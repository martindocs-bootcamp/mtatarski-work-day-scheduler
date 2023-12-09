$(document).ready(function() {
  let getLocalStorage = JSON.parse(localStorage.getItem('workSchedule'));  
  if(!getLocalStorage) {
    localStorage.setItem('workSchedule', JSON.stringify([]));
  }
  if(!getLocalStorage) getLocalStorage = [];
  
  // console.log(getLocalStorage);

   // Current day
  // const currentDay = dayjs();
  const workDay = dayjs().format('dddd, MMMM DD')

  // Display current day
  $('#currentDay').text(workDay);

  // Color coded timeblocks
  const currentHour = Number(dayjs().format('H'));
  // console.log(dayjs().daysInMonth());

  // Days of the month
  const daysInTheMonth = dayjs().daysInMonth();
  const dayOfTheMonth = Number(dayjs().format('D'));

  const arr = Array.from({length: daysInTheMonth}, (_, i)=> i + 1);
  const ul = $('#nav');
  ul.attr('data-day', dayOfTheMonth);
  
  arr.forEach((day)=>{
    const li = $('<li>');
    li.addClass('nav-item');
    
    const a = $('<button>')
    a.addClass('nav-link');

    if(day === dayOfTheMonth){
      a.addClass('active');
      a.attr('aria-current', 'page');      
    }

    a.text(day);

    li.append(a);
    ul.append(li);    
  })


  $('.hour').each(function () {
    const hour = Number($(this).attr('data-hour'));
    // const dataText = $(this).next().find('textarea').val();
   
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


  let findCurrentSchedule = getLocalStorage.find((data) => data.date === dayjs().format('dddd, MMMM DD'));

  // Populate with data for current work schedule  
  if(findCurrentSchedule){   
    // console.log(findCurrentSchedule.data[9]);
    $('.hour').each(function(){
      const hour = $(this).attr('data-hour');
      const dataText = $(this).next().find('textarea');

      dataText.text(findCurrentSchedule.data[hour]); 
    })
  }


  // Change the date
  $('#nav').on('click', '.nav-item' ,function(){

    // Change the tab day 
    const day = $(this).children();   
   
    // Remove previous active tab
    const links = $('.nav-link');
    for(let i = 0; i < links.length; i++){
      const link = $(links[i]);
            
      if(link.hasClass('active')){
        link.removeClass('active');
        link.removeAttr('aria-current');
        break;
      }
    }
    
    // Set new active tab
    day.attr('aria-current', 'page');
    day.addClass('active');

    // Set new date
    const newDate = dayjs().set('date', day.text()).format('dddd, MMMM DD');  
    
        // Find data based of new date
    let searchSchedule = getLocalStorage.find((data) => data.date === newDate);
 

    if(!searchSchedule) {
      $('.hour').each(function(){
        const dataText = $(this).next().find('textarea');         
        dataText.text(''); 
      })
    }else{
      $('.hour').each(function(){
        const hour = $(this).attr('data-hour');
        const dataText = $(this).next().find('textarea');
  
        dataText.text(searchSchedule.data[hour]); 
      })
    }

  })  




  // Save to local storage
  $('#save').on('click', 'button' , function() {    
    
    const links = $('.nav-link');
    let day = '';
    for(let i = 0; i < links.length; i++){
      const link = $(links[i]);
            
      if(link.hasClass('active')){
        day = link.text();
        break;
      }
    }

    // Set new date
    const newDate = dayjs().set('date', day).format('dddd, MMMM DD');  

    let findCurrentSchedule = getLocalStorage.find((data) => data.date === newDate);
   

    if(!findCurrentSchedule){
      const saveTodayWorkSchedule = {
        date: newDate,
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