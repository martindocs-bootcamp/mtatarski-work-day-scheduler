$(document).ready(function() {
  let getLocalStorage = JSON.parse(localStorage.getItem('workSchedule'));  
  if(!getLocalStorage) {
    localStorage.setItem('workSchedule', JSON.stringify([]));
  }
  if(!getLocalStorage) getLocalStorage = [];
  
  console.log(getLocalStorage);
   // Current day
  const currentDay = dayjs();
  const workDay = currentDay.format('dddd, MMMM DD')

  // Display current day
  $('#currentDay').text(workDay);

  // Color coded timeblocks
  const currentHour = Number(dayjs().format('H'));
  // console.log(dayjs().daysInMonth());

  $('.hour').each(function () {
    const hour = Number($(this).attr('data-hour'));
    
    if(hour === currentHour) {
      $(this).parent().addClass('present');
    }else if(hour > currentHour){
      $(this).parent().addClass('future');
      // $('textarea').attr('disabled', false);      
    }else{
      $(this).parent().addClass('past');
      // $('textarea').attr('disabled', true);
    }
  })


  // Save to local storage
  $('#save').on('click', 'button' , function(e) {    
    // console.log(e);
   
    let findCurrentSchedule = getLocalStorage.find((data) => data.date === dayjs().format('dddd, MMMM DD'));

    // console.log(findCurrentSchedule);
    if(!findCurrentSchedule){
      const saveTodayWorkSchedule = {
        date: dayjs().format('dddd, MMMM DD'),
        data: {}
      };

      let hour = 9;

      $('.text-data').each(function(){
        const textEntry = $(this).val();
        saveTodayWorkSchedule.data[hour] = textEntry;
        hour++;
      });

      getLocalStorage.push(saveTodayWorkSchedule);  
      localStorage.setItem('workSchedule', JSON.stringify(getLocalStorage));

    }else{     
      let hour = 9;

      $('.text-data').each(function(){
        const textEntry = $(this).val();
        findCurrentSchedule.data[hour] = textEntry;
        hour++;
      });

      localStorage.setItem('workSchedule', JSON.stringify(getLocalStorage));
    }    

  });

  







});