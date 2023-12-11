$(document).ready(function() {

  // Get the data from the localStorage
  let getLocalStorage = JSON.parse(localStorage.getItem('workSchedule'));  
  if(!getLocalStorage) {
    localStorage.setItem('workSchedule', JSON.stringify([]));
  }

  // Ensure that getLocalStorage is always initialized as an array,
  // whether it was retrieved from localStorage or created as new
  if(!getLocalStorage) getLocalStorage = [];  
 
  // Extends dayjs() API to display Day of Month with ordinal suffix
  dayjs.extend(window.dayjs_plugin_advancedFormat);

  // Current date  
  const currentDate = dayjs().format('dddd, MMMM Do')

  // Display current day to the screen
  $('#currentDay').text(currentDate);

  // Get all days in the month
  const daysInTheMonth = dayjs().daysInMonth();

  // Current day in the month
  const currentDayOfTheMonth = Number(dayjs().format('D'));

  // Function to render days in the month
  const renderDays = function(){
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
  }

  // Function to set color-coded timeblocks
  const setColorCodedTimeblocks = function(){
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
    });
  }

  // Function to load data from localStorage
  const loadDataFromLocalStorage = function(){
    // Find data in the localStorage for the current date Work Schedule
    let findCurrentSchedule = getLocalStorage.find((data) => data.date === currentDate);
  
    if(findCurrentSchedule){   
      // Loop through textarea fields and append data from the localStorage
      $('.hour').each(function(){
        const hour = $(this).attr('data-hour');
        const dataText = $(this).next().find('textarea');
        
        // Crate icon 
        const icon = $('<i>');
        icon.addClass('far fa-trash-alt trash-bin');        
        
        // Display data to screen       
        dataText.val(findCurrentSchedule.data[hour]); 
              
        // Add trash bin icon if the text exists in textarea
        if(dataText.val()){
          $(this).next().append(icon);
        }      
      })
    }
  }

  // Function to display the message to the user
  const displayMessage = function(msg, color){
    // Check if there is an existing message to prevent from multiple messages being displayed
    if ($('.msg').length > 0) {
      return false; // Message is still on
    }
    
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

    return true; // Message displayed successfully
  }

  // Function handles the user interaction when clicking on days/tabs.
  const switchTab = function(){
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
    const newDate = dayjs().set('date', day.text()).format('dddd, MMMM Do');  
    
    // Find data in the localStorage based of new date
    let searchNewSchedule = getLocalStorage.find((data) => data.date === newDate);
    
    // Display data to the screen
    $('.hour').each(function(){

      // If there is no data for this date then clear all textareas
      if(!searchNewSchedule){        
        const dataText = $(this).next().find('textarea');   
        dataText.val(''); 
        $(this).next().find('.trash-bin').remove(); // Remove trash bin icons     
      }else{
        // Othervise display the data
        const hour = $(this).attr('data-hour');
        const dataText = $(this).next().find('textarea');      
        
        // Add trash bin icon if the data exists
        const icon = $('<i>');
        icon.addClass('far fa-trash-alt trash-bin');  
        
        dataText.val(searchNewSchedule.data[hour]);           
        
        if(!dataText.val()){
          $(this).next().find('.trash-bin').remove();          
        }else{                    
          $(this).next().append(icon);          
        }
      }
    });
  }

  // Function save the data to the localStorage
  const saveToLocalStorage = function(){
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
    const activeTabDate = dayjs().set('date', day).format('dddd, MMMM Do');  

    // Find data in localStorage for the current based of new date
    let findActiveTabData = getLocalStorage.find((data) => data.date === activeTabDate); 

    // Add trash bin icon if the data exists
    const icon = $('<i>');
    icon.addClass('far fa-trash-alt trash-bin');    

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

      // add trash bin icon on save
      $(this).closest('.time-block').find('textarea').parent().append(icon);

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
   
      // add trash bin icon on save
      $(this).closest('.time-block').find('textarea').parent().append(icon);     

      // Display the message when the data is updated
      displayMessage('✔ Appointments Added to localStorage', 'green');
    } 
  }

  // Function display the modal window when user clicks on the trash bin icon
  const showModal = function(){
    $(this).siblings('.modal-clear').css('display', 'block');
    $(this).closest('.entry').find('textarea').addClass('text-visibility');
  }

  // Function clears the textarea content
  const clearContent = function(){
    const confirmClear = $(this).attr('data-confirm');

    if(confirmClear === 'yes') {

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
      const activeTabDate = dayjs().set('date', day).format('dddd, MMMM Do');  

      // Find data in localStorage for the current based of new date
      let findActiveTabData = getLocalStorage.find((data) => data.date === activeTabDate); 

      if(!findActiveTabData){
        displayMessage('No data to delete', 'red');
      }else {
        $(this).closest('.entry').find('textarea').val('');      

        // Othervise update existing data
        let hour = 9;
        $('.text-data').each(function(){
          const textEntry = $(this).val();
          findActiveTabData.data[hour] = textEntry;
          hour++;
        });

        // Save to localStorage
        localStorage.setItem('workSchedule', JSON.stringify(getLocalStorage));
        
        $(this).closest('.entry').find('.modal-clear').css('display', 'none'); 
        $(this).closest('.entry').find('textarea').removeClass('text-visibility');
        $(this).closest('.entry').find('.trash-bin').remove(); // remove trash bin
        
        // Display the message when the data is updated
        displayMessage('✔ Appointments Removed from localStorage', 'green');
      }

    }else if(confirmClear === 'no'){      
      $(this).closest('.entry').find('.modal-clear').css('display', 'none'); 
      $(this).closest('.entry').find('textarea').removeClass('text-visibility');
    }
  }

  // Render days in the month
  renderDays();

  // Set color-coded timeblocks
  setColorCodedTimeblocks();

  // Load data from localStorage
  loadDataFromLocalStorage();

  // Event listener for switch between tabs 
  $('#nav').on('click', '.nav-item', switchTab);  

  // Event listener to save to localStorage
  $('#save').on('click', 'button' , saveToLocalStorage);  

  // Event listener to show the modal window
  $('#save').on('click', '.trash-bin', showModal);

  // Event listener to clear the content of the textarea
  $('#save').on('click', '.btn-clear', clearContent);

});