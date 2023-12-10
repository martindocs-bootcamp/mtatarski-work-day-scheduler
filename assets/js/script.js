$(document).ready(function() {
  let getLocalStorage = JSON.parse(localStorage.getItem('workSchedule'));  
  if(!getLocalStorage) {
    localStorage.setItem('workSchedule', JSON.stringify([]));
  }
  if(!getLocalStorage) getLocalStorage = [];  
  // console.log(getLocalStorage);

  // Current date  
  const currentDate = dayjs().format('dddd, MMMM DD')

  // Display current day
  $('#currentDay').text(currentDate);

  // All days in the month
  const daysInTheMonth = dayjs().daysInMonth();

  // Current day in the month
  const currentDayOfTheMonth = Number(dayjs().format('D'));

  // Create an array of days in the month
  const getAllDaysInMonth = Array.from({length: daysInTheMonth}, (_, i)=> i + 1);
  const ul = $('#nav');
  ul.attr('data-day', currentDayOfTheMonth);
  
  // Create tab for each day of the month
  getAllDaysInMonth.forEach((day)=>{
    const li = $('<li>');
    li.addClass('nav-item');
    
    const a = $('<button>')
    a.addClass('nav-link');
    
    // Set active tab to current day 
    if(day === currentDayOfTheMonth){
      a.addClass('active');
      a.attr('aria-current', 'page');      
    }

    a.text(day);

    li.append(a);
    ul.append(li);    
  })

  // Set color coded timeblocks for each day
  const currentHour = Number(dayjs().format('H'));
  $('.hour').each(function () {
    const hour = Number($(this).attr('data-hour'));
   
    if(hour === currentHour) {
      $(this).parent().addClass('present');
    }else if(hour > currentHour){
      $(this).parent().addClass('future');     
    }else{
      $(this).parent().addClass('past');      
    }
  })

  // Find data for the current Work Schedule
  let findCurrentSchedule = getLocalStorage.find((data) => data.date === currentDate);
 
  // Display data for current date work schedule  
  if(findCurrentSchedule){   
    $('.hour').each(function(){
      const hour = $(this).attr('data-hour');
      const dataText = $(this).next().find('textarea');

      dataText.val(findCurrentSchedule.data[hour]); 
    })
  }

  // Switch between tabs 
  $('#nav').on('click', '.nav-item' ,function(){
   
    // Current tab 
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
    let searchNewSchedule = getLocalStorage.find((data) => data.date === newDate);
  
    // Display data for new date work schedule
    $('.hour').each(function(){
      if(!searchNewSchedule){        
        const dataText = $(this).next().find('textarea');   
        dataText.val('');                           
      }else{
        const hour = $(this).attr('data-hour');
        const dataText = $(this).next().find('textarea');      
        dataText.val(searchNewSchedule.data[hour]); 
      }
    });
  });  


  // Save to local storage
  $('#save').on('click', 'button' , function() {    
    
    // Get the day of active tab
    const links = $('.nav-link');
    let day = '';
    for(let i = 0; i < links.length; i++){
      const link = $(links[i]);
            
      if(link.hasClass('active')){
        day = link.text();
        break;
      }
    }

    // Set new date based on active tab
    const activeTabDate = dayjs().set('date', day).format('dddd, MMMM DD');  

    // Find data for the current tab Work Schedule
    let findActiveTabData = getLocalStorage.find((data) => data.date === activeTabDate);   

    // Crate data if not found
    if(!findActiveTabData){
      const saveTabWorkSchedule = {
        date: activeTabDate,
        data: {}
      };

      let hour = 9;

      // Append data based on active tab 
      $('.text-data').each(function(){
        const textEntry = $(this).val();
        saveTabWorkSchedule.data[hour] = textEntry;
        hour++;
      });

      // Save to local storage
      getLocalStorage.push(saveTabWorkSchedule);  
      localStorage.setItem('workSchedule', JSON.stringify(getLocalStorage));
      displayMessage('Appointment Added to local storage ✔ ');

    }else{    
      
      // Othervise update existing data
      let hour = 9;

      $('.text-data').each(function(){
        const textEntry = $(this).val();
        findActiveTabData.data[hour] = textEntry;
        hour++;
      });

      // Save to local storage
      localStorage.setItem('workSchedule', JSON.stringify(getLocalStorage));
      displayMessage('Appointments Added to local storage ✔ ');
    }    
  });  


  const displayMessage = function(msg){
        
    const p = $('<p>');
    p.text(msg);

    // append as first child in the container
    $('#save').prepend(p); 

    setTimeout(function(){
      p.remove();
    }, 1000);
  }

});