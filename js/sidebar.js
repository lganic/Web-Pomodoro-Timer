document.getElementById('toggle-btn').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded');
});


document.getElementById('focus-time-input').addEventListener('input', function () {
    if(validateInput('focus-time-input', 1, 9999, 'focus-time-error')){
        update_sidebar_schedule();
    }
});

document.getElementById('break-time-input').addEventListener('input', function () {
    if(validateInput('break-time-input', 1, 9999, 'break-time-error')){
        update_sidebar_schedule();
    }
});

document.getElementById('lb-time-input').addEventListener('input', function () {
    if(validateInput('lb-time-input', 1, 9999, 'lb-time-error')){
        update_sidebar_schedule();
    }
});

document.getElementById('lb-count-input').addEventListener('input', function () {
    if(validateInput('lb-count-input', 1, 9999, 'lb-count-error')){
        update_sidebar_schedule();
    }
});


function validateInput(inputId, min, max, errorId) {
    const input = document.getElementById(inputId);
    const errorMessage = document.getElementById(errorId);
    const value = parseInt(input.value, 10);

    if (isNaN(value) || value < min || value > max) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorMessage.style.display = 'block';
        return false;
    } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorMessage.style.display = 'none';
        return true;
    }
}


// Add event listener to the checkbox
document.getElementById('lb-checkbox').addEventListener('change', function() {
    const extraContent = document.getElementById('lb-content');
    
    // Show content if checked, hide if unchecked
    if (this.checked) {
      extraContent.classList.add('show');
    } else {
      extraContent.classList.remove('show');
    }
    update_sidebar_schedule();
  });

  function update_sidebar_schedule() {

    let size = 15;

    const schedule_div = document.getElementById('schedule');

    schedule_div.innerHTML = '';

    let output = '<table>'

    for(index = 0; index < size; index++){

        left_content = '';
        if (index == 0){
            left_content = '→';
        }

        let settings = cycle_at_index(index + pomo_sequence_index);

        let mode = settings['mode'];
        let time = settings['time'];

        right_content = `${mode_text(mode)} (${time}m)`;

        output += `<tr onclick="pomo_sequence_index=${index + pomo_sequence_index - 1};increment_and_start()" style="cursor: pointer"><th>` + left_content +`</th><th style="background-color:${mode_colors(mode)}">` + right_content + '</th></tr>';

    }

    output += '</table>'

    schedule_div.innerHTML = output;
    
  }


  document.addEventListener("DOMContentLoaded", (event) => {
    update_sidebar_schedule();

    const extraContent = document.getElementById('lb-content');
    extraContent.classList.add('show'); // To show long break options
  });
  

//   <table>
//   <tr>
//     <th>Company</th>
//     <th>Contact</th>
//     <th>Country</th>
//   </tr>
// </table>