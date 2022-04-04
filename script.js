var currentHour = 9; 
var currentDate = ""; 
var currentDateString = ""; 
var timeEntries = []; 

const firstEntry = 9; 
const lastEntry = 17; 

//local storage
const timeEntryName = "workDaySchedulerList"; 

// hour array day
const hourMap = ["12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"]; 

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

setCurrentDateAndHour(); 
buildTimeBlocks();
getTimeEntries(); 

$(".saveBtn").click(saveClick); 

// load page date
function setCurrentDateAndHour() {
    var today = new Date(); 
    var day = today.getDate();
    var dayEnd = "th"; 

    currentHour = today.getHours(); 


    if (day < 10) {
        currentDate = today.getFullYear() + months[today.getMonth()] + "0" + day; 
    }
    else {
        currentDate = today.getFullYear() + months[today.getMonth()] + day;
    }

  
    if ((day === 1) || (day === 21) || (day === 31)) {
        dayEnd = "st";
    }
    else if ((day === 2) || (day === 22)) {
        dayEnd = "nd";
    }
    else if ((day === 3) || (day === 23)) {
        dayEnd = "rd";
    }
    else {
       dayEnd = "th"; 
    }
    

    currentDateString = days[today.getDay()] + ", " + months[today.getMonth()] + " " +  day + dayEnd + ", " + today.getFullYear(); 
    $("#currentDay").text(currentDateString); 
}

function buildTimeBlocks() {
    var containerDiv = $(".container"); 

    // time loop
    for (let hourBlock=firstEntry; hourBlock <= lastEntry; hourBlock++) {
       
        var newHtml = '<div class="row time-block"> ' + '<div class="col-md-1 hour">' + hourMap[hourBlock] + '</div> ';
        
        if (hourBlock < currentHour) {
            newHtml = newHtml + '<textarea class="col-md-10 description past" id="text' + hourMap[hourBlock] + '"></textarea> ';
        }
        else if (hourBlock === currentHour) {
            newHtml = newHtml + '<textarea class="col-md-10 description present" id="text' + hourMap[hourBlock] + '"></textarea> ';
        }
        else {
            newHtml = newHtml + '<textarea class="col-md-10 description future" id="text' + hourMap[hourBlock] + '"></textarea> ';
        };

        newHtml = newHtml + '<button class="btn saveBtn col-md-1" value="' + hourMap[hourBlock] + '">' +
            '<i class="fas fa-save"></i></button> ' +
            '</div>';

 // container elements
        containerDiv.append(newHtml);
    }
}

// loads timeEntries array from localstorage
function getTimeEntries() {
    var teList = JSON.parse(localStorage.getItem(timeEntryName));

    if (teList) {
        timeEntries = teList;
    }

    for (let i=0; i<timeEntries.length; i++) {
        if (timeEntries[i].day == currentDate) {
            $("#text"+timeEntries[i].time).val(timeEntryName[i].text);
        }
    }
}

// buttons
function saveClick() {
    var hourBlock = $(this).val();
    var entryFound = false;
    var newEntryIndex = timeEntries.length; 
    var newEntry = {day: currentDate, time: hourBlock, text: $("#text"+hourBlock).val()}; 

    
    function timeGreater(time1,time2) {
        var num1 = parseInt(time1.substring(0, time1.length-2)); 
        var num2 = parseInt(time2.substring(0, time2.length-2)); 
        var per1 = time1.substr(-2,2); 
        var per2 = time2.substr(-2,2); 

        
        if (num1 === 12) {
            num1 = 0;
        }

        if (num2 === 12) {
            num2 = 0;
        }

     
        if (per1 < per2) {
            return false; 
        }
        else if (per1 > per2) {
            return true; 
        }
        else {
            return (num1 > num2);
        }
    }

   
    for (let i=0; i<timeEntries.length; i++) {
        if (timeEntries[i].day == currentDate) {
            if (timeEntries[i].time == hourBlock) {
                timeEntries[i].text = newEntry.text; 
                entryFound = true; 
                break;
            }
           
            else if (timeGreater(timeEntries[i].time, hourBlock)) {
                newEntryIndex = i;
                break;
            }
        }
    
        else if (timeEntries[i].day > currentDate) {
            newEntryIndex = i;
            break;
        }
    }


    if (!entryFound) {
        timeEntries.splice(newEntryIndex, 0, newEntry);
    }

    // store in local storage
    localStorage.setItem(timeEntryName, JSON.stringify(timeEntries));
}
