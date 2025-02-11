function fetch_settings(){

    output = {}

    function quick_fetch(field_id){
        return parseInt(document.getElementById(field_id).value, 10);
    }

    const checkbox = document.getElementById('lb-checkbox');
    output['breaks-enabled'] = checkbox.checked;

    output['focus-time'] = quick_fetch('focus-time-input');
    output['break-time'] = quick_fetch('break-time-input');
    output['long-break-time'] = quick_fetch('lb-time-input');
    output['long-break-count'] = quick_fetch('lb-count-input');

    return output;
}

function cycle_at_index(pomo_index){

    const settings = fetch_settings();

    function simple_fetch(index){
        if(index%2 == 0){
            // Work time!
            return{
                'mode': 'focus',
                'time': settings['focus-time']
            }
        }
        return {
            'mode': 'break',
            'time': settings['break-time']
        }
    }

    if (!settings['breaks-enabled']){
        return simple_fetch(pomo_index);
    }

    full_cycle_length = 2 * settings['long-break-count'];

    index_in_cycle = pomo_index % full_cycle_length;

    if (index_in_cycle == full_cycle_length - 1){
        return {
            'mode': 'long-break',
            'time': settings['long-break-time']
        }
    }

    return simple_fetch(index_in_cycle);
}

function mode_colors(mode){
    const colors = {
        'break': '#197a14',
        'focus': '#f4c542',
        'long-break': '#083f99'
    }

    return colors[mode];
}

function mode_text(mode){
    const text_descriptions = {
        'focus': 'Focus',
        'break': 'Break',
        'long-break': 'Long Break'
    }

    return text_descriptions[mode];
}

function check_100(){

    for(let index = 0; index < 100; index +=1){
        console.log(index);
        console.log(cycle_at_index(index));
    }
}