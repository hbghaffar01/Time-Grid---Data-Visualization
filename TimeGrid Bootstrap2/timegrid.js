function gup( name ) {
    name = name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
    return "";
    else
    return results[1];
    }
  
    
    // PHP Data Fetching
    function loadPHP(){
    fetch('select_data.php')
    .then((response) => response.text())
    .then((data) => {
      // for(var x in data){
      //   var a = `${data[x]}`;
      //   console.log(a);
      // }
      var a = `${data}`;
      console.log(a);
      document.querySelectorAll(".vis-item-content").innerText = a;
    });
    }
    loadPHP();


    
    // get selected item count from url parameter
    var count = (Number(gup('count')) || 2);
    
    // user Status 3
    var userStatus;
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    function updateOnlineStatus(event) {
    userStatus = navigator.onLine ? "online" : "offline";
    }  
    updateOnlineStatus();
    
    // create groups
    var now = new Date();
    var itemCount = count;
    var newGroupIds = [];
    // create a data set with groups
    var names = ['', `Michael	Ackermann<br>${userStatus}`, `Patrick	Heinrich<br>${userStatus}`];
    var len = names.length;
    var groupCount = len;
    var groups = new vis.DataSet();
    for (var g = 0; g < groupCount; g++) {
    groups.add({id: g, content: names[g]});
    }
    
    var objectLenght;
    objectLenght = Object.keys(groups).length;
    
    
    // create items
    var items = new vis.DataSet();
    
    var itemCount = 1;
    var names = 1;
    for (var j = 0; j <= objectLenght; j++) {
    var date = new Date();
    for (var i = 0; i <= count/objectLenght * 1.6; i++) {
    // date.setHours(date.getHours() +  4 * (Math.random() < 0.2));
    date.setHours(date.getHours() +  2 * (Math.random() < 0.2));
    
    var start = new Date(date);
    
    // date.setHours(date.getHours() + 2 + Math.floor(Math.random()*4));
    date.setHours(date.getHours() + 2 + Math.floor(Math.random()*2));
    
    
    var end = new Date(date);
    var group = Math.floor(Math.random() * groupCount);
    items.add({
      id: itemCount,
      group: names,
      start: start,
      end: end,
      content: 'Test item ' + itemCount,
      // content: loadPHP(),
    }),
    
    itemCount++;
    }
    names++;
    }
    
    // Groups Add Start
    // Function to add a group
    document.getElementById('buttonAdd').onclick = function addGroup() {
    var newGroupId = Math.random();
    // user Status 3
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    function updateOnlineStatus(event) {
     userStatus = navigator.onLine ? "online" : "offline";
    }  
    updateOnlineStatus();
    groups.add({id: newGroupId, content: prompt('Enter text content for New Group:') + '<br>' + userStatus});
    newGroupIds.push(newGroupId);
    }
    
    // Function to remove last added group
    document.getElementById('buttonRemove').onclick = function removeGroup() {
    var newGroupId = newGroupIds.pop();
    if (newGroupId) {
    groups.remove(newGroupId);
    }
    }
    
    // upDate Group Last Added Group
    document.getElementById('buttonChange').onclick = function changeGroup() {
    var newGroupId = newGroupIds[newGroupIds.length-1];
    
    // user Status 3
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    function updateOnlineStatus(event) {
     userStatus = navigator.onLine ? "online" : "offline";
    }  
    updateOnlineStatus();
    
    
    if (newGroupId) {
    groups.update({id: newGroupId, content: prompt('Update text content of a Group:') + '<br>' + userStatus});
    }
    }
    // Groups Add End
    
    var options = {
    groupOrder: 'content',
    editable: true,
    stack: false,
    start: new Date(),
    // end: new Date(1000*60*60*24 + (new Date()).valueOf()),
    end: new Date(1000*60*60*24 / 2 + (new Date()).valueOf()),
    
    editable: true,
    margin: {
    item: 10, // minimal margin between items
    axis: 5,   // minimal margin between items and 
    },
    orientation: 'top',
    
    editable: true,
    
    onAdd: function (options, callback) {
    prettyPrompt('Add item', 'Enter text content for new item:', options.content, function (value) {
      if (value) {
        options.content = value;
        callback(options); // send back adjusted new item
      }
      else {
        callback(null); // cancel item creation
      }
    });
    var style;
    style.background = '#ccc'
    },
    
    onMove: function (options, callback) {
    var title = 'Do you really want to move the item to\n' +
        'start: ' + options.start + '\n' +
        'end: ' + options.end + '?';
    
    prettyConfirm('Move item', title, function (ok) {
      if (ok) {
        callback(options); 
      }
      else {
        callback(null); // cancel editing item
      }
    });
    },
    
    onUpdate: function (options, callback) {
    prettyPrompt('Update item', 'Edit items text:', options.content, function (value) {
      if (value) {
        options.content = value;
        callback(options); // send back adjusted item
      }
      else {
        callback(null); // cancel updating the item
      }
    });
    },
    
    onRemove: function (options, callback) {
    prettyConfirm('Remove item', 'Do you really want to remove item ' + options.content + '?', function (ok) {
      if (ok) {
        callback(options); // confirm deletion
      }
      else {
        callback(null); // cancel deletion
      }
    });
    }
    };
    // create a Timeline
    var container = document.getElementById('visualization');
    var timeline = new vis.Timeline(container);
    timeline.setOptions(options);
    timeline.setGroups(groups);
    timeline.setItems(items);
    timeline.setItems(null);
    items.on(function (event, properties) {
    logEvent(event, properties);
    });
    
    function logEvent(event, properties) {
    var log = document.getElementById('log');
    var msg = document.createElement('div');
    msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
      'properties=' + JSON.stringify(properties);
    log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
    };
    
    function prettyConfirm(title, text, callback) {
    swal({
    title: title,
    text: text,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: "#DD6B55"
    }, callback);
    };
    
    function prettyPrompt(title, text, inputValue, callback) {
    swal({
    title: title,
    text: text,
    type: 'input',
    showCancelButton: true,
    inputValue: inputValue
    }, callback);
    };
    
    timeline.setGroups(groups);
    timeline.setItems(items);
    
    document.getElementById('count').innerHTML = count;
    
    // Modal start
    const openModelButtons = document.querySelectorAll('[data-model-target]')
const closeModelButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModelButtons.forEach(button => {
button.addEventListener('click', () => {
const model = document.querySelector(button.dataset.modelTarget)
openModal(model)
})
})

overlay.addEventListener('click', () => {
const models = document.querySelectorAll('.model.active')
models.forEach(model => {
closeModel(model)
})
})

closeModelButtons.forEach(button => {
button.addEventListener('click', () => {
const model = button.closest('.model')
closeModal(model)
})
})

function openModal(modal) {
if (modal == null) return
modal.classList.add('active')
overlay.classList.add('active')
}

function closeModal(modal) {
if (modal == null) return
modal.classList.remove('active')
overlay.classList.remove('active')
};
// Modal end


// Date picker 
$(function(){
    $("#date").datepicker({dateFormat: 'yy/mm/dd'});
    })
      error: function error(err) {
        console.log('Error', err);
        if (err.status === 0) {
          alert('Failed to load data/basic.json.\nPlease run this example on a server.');
        }
        else {
          alert('Failed to load data/basic.json.');
        }
      } 
// Date picker end