$(document).ready(function() {

  // Current day
  // const currentDay = dayjs();
  const workDay = dayjs().format('dddd, MMMM DD')

  // Display current day
  $('#currentDay').text(workDay);



  const currentHour = Number(dayjs().format('H'));
  $('.hour').each(function () {
    const hour = Number($(this).attr('data-time'));
    // console.log(hour);
    
    if(hour === currentHour) {
      $(this).parent().addClass('present');
    }else if(hour > currentHour){
      $(this).parent().addClass('future');
      
    }else{
      $(this).parent().addClass('past');

    }


  })



  // $('#save').on('click', 'button' , function(e) {    
    
  //   const localStorageData = [{

  //   }];

  // });

  







});