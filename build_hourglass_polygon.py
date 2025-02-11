pinch_factor = 8
hole_width = .1

y_range = 1.3

delta = .01

percent_border = 6

# ======================

def normalize_in_place(lst):

    min_val = min(lst)
    max_val = max(lst)

    for index, item in enumerate(lst):

        lst[index] = (item - min_val) / (max_val - min_val)
    
    return lst

def rad_perc(k):

    d = 1 - (2 * percent_border / 100)

    return round(d * k + percent_border, 3)

outputs = []
border_outputs = []

for mode in range(0, 2):

    k = 0

    left_x_points = []
    right_x_points = []

    y_points = []

    while k * delta < y_range:

        if mode == 0:
            y = k * delta - y_range
        else:
            y = k * delta

        y_points.append(y)

        x_left = (1 / (1 + pinch_factor * y * y)) - 1 - hole_width

        x_right = 1 + hole_width - (1 / (1 + pinch_factor * y * y))

        left_x_points.append(x_left)
        right_x_points.append(x_right)

        k += 1

    # Assemble polygon points

    final_x_points = []
    final_y_points = []

    # up the left side

    final_x_points += left_x_points.copy()
    final_y_points += y_points.copy()

    # Down the right side

    final_x_points += right_x_points.copy()[::-1]
    final_y_points += y_points.copy()[::-1]

    # Normalize the points

    normalize_in_place(final_x_points)
    normalize_in_place(final_y_points)

    # Convert to percent coordinates

    output_string = ''
    border_string = ''

    for x, y in zip(final_x_points, final_y_points):

        print(f'({round(x * 100, 3)},{round(y * 100, 3)})',end=',', flush=True)

        x_percent = round(x * 100, 3)
        y_percent = round(y * 100, 3)

        output_string += f'{x_percent}% {y_percent}%,'

        border_x_percent = rad_perc(x_percent)
        border_y_percent = rad_perc(y_percent)

        border_string += f'{border_x_percent}% {border_y_percent}%,'


    print()

    if mode == 0:
        print('Top half:')
    else:
        print('Bottom half:')

    output_string = output_string[:-1] # Chop off trailing ,
    border_string = border_string[:-1]

    outputs.append(output_string)
    border_outputs.append(border_string)

    print(output_string)
    print(border_string)
    print('==============================')


r_curly = '}'
l_curly = '{' # im lazy

s = f"""/* Top half: an inverted triangle */
.top-half-b {l_curly}
    clip-path: polygon({border_outputs[0]});
    transform: translateY(-200%);
    background: black;
{r_curly}
/* Bottom half: a triangle with apex at the top center */
.bottom-half-b {l_curly}
    clip-path: polygon({border_outputs[1]});
    /* Slight overlap to merge with top half */
    transform: translateY(-200%);
    background: black;
{r_curly}


/* Top half: an inverted triangle */
.top-half {l_curly}
    clip-path: polygon({outputs[0]});
    background: #eee;
{r_curly}
/* Bottom half: a triangle with apex at the top center */
.bottom-half {l_curly}
    clip-path: polygon({outputs[1]});
    background: #eee;
{r_curly}
"""

with open('css/hourglass.css', 'w') as f:
    f.write(s)