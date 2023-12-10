$(document).ready(function() {

  // Get the data from the localStorage
  let getLocalStorage = JSON.parse(localStorage.getItem('workSchedule'));  
  if(!getLocalStorage) {
    localStorage.setItem('workSchedule', JSON.stringify([]));
  }

  // Ensure that getLocalStorage is always initialized as an array,
  // whether it was retrieved from localStorage or created as new
  if(!getLocalStorage) getLocalStorage = [];  
 
  // Current date  
  const currentDate = dayjs().format('dddd, MMMM DD')

  // Display current day to the screen
  $('#currentDay').text(currentDate);

  // Get all days in the month
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
    
    const button = $('<button>')
    button.addClass('nav-link');
    
    // Set active tab to current day 
    if(day === currentDayOfTheMonth){
      button.addClass('active');
      button.attr('aria-current', 'page');      
    }

    button.text(day);

    li.append(button);
    ul.append(li);    
  })

  // Set color coded timeblocks for each hour
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

  // Find data in the localStorage for the current date Work Schedule
  let findCurrentSchedule = getLocalStorage.find((data) => data.date === currentDate);
 
  // Display data to screen 
  if(findCurrentSchedule){   
    $('.hour').each(function(){
      const hour = $(this).attr('data-hour');
      const dataText = $(this).next().find('textarea');

      dataText.val(findCurrentSchedule.data[hour]); 
    })
  }

  // Function to display the message when user clicks the save button
  const displayMessage = function(msg, color){
    
    // Create a new p tag to display the message
    const p = $('<p>');
    p.addClass('msg')
    p.text(msg);
    p.css('color', color);

    // append as first child in the container
    $('#save').prepend(p); 

    // Remove msg after 2 seconds
    setTimeout(function(){
      p.remove();
    }, 2000);
  }

  // Event listener to switch between tabs 
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
   
    // Find data in the localStorage based of new date
    let searchNewSchedule = getLocalStorage.find((data) => data.date === newDate);
  
    // Display data to the screen
    $('.hour').each(function(){

      // If there is no data for this date then clear all textareas
      if(!searchNewSchedule){        
        const dataText = $(this).next().find('textarea');   
        dataText.val('');                           
      }else{
        // Othervise display the data
        const hour = $(this).attr('data-hour');
        const dataText = $(this).next().find('textarea');      
        dataText.val(searchNewSchedule.data[hour]); 
      }
    });
  });  


  // Event listener to save to localStorage
  $('#save').on('click', 'button' , function() {    
    
    const saveButtons = $('.saveBtn');
    
    try{
      // Disable the save buttons when user click save to prevent from multiple clicks
      saveButtons.each(function() {
        $(this).attr('disabled', true);
      })      
    }catch(err){
      console.log('Error saving data to local storage:', err)
    }finally{
      // Re-enable the button after 2 second delay
      setTimeout(function() {
        saveButtons.attr('disabled', false);
      }, 2000);
    }

    // Get the textarea content
    const textarea = $(this).closest('.row').find('textarea').val();

    // If textarea is empty prevent from saving to localStorage
    if(!textarea){
      displayMessage('✗ Text area cannot be empty', 'red');
      return;
    }
    
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

    // Find data in localStorage for the current based of new date
    let findActiveTabData = getLocalStorage.find((data) => data.date === activeTabDate);   

    // Create variable to store data if not found in localStorage
    if(!findActiveTabData){
      const saveTabWorkSchedule = {
        date: activeTabDate,
        data: {}
      };

      // set the variable to the earliest hour
      let hour = 9;

      // Append data based on active tab 
      $('.text-data').each(function(){
        const textEntry = $(this).val();
        saveTabWorkSchedule.data[hour] = textEntry;
        hour++; 
      });

      // Add new data
      getLocalStorage.push(saveTabWorkSchedule);  

      // Save to localStorage
      localStorage.setItem('workSchedule', JSON.stringify(getLocalStorage));

      // Display the message when the data is saved
      displayMessage('✔ Appointment Added to localStorage', 'green');

    }else{    
      
      // Othervise update existing data
      let hour = 9;
      $('.text-data').each(function(){
        const textEntry = $(this).val();
        findActiveTabData.data[hour] = textEntry;
        hour++;
      });

      // Save to localStorage
      localStorage.setItem('workSchedule', JSON.stringify(getLocalStorage));

      // Display the message when the data is updated
      displayMessage('✔ Appointments Added to localStorage', 'green');
    }    
  });  
});