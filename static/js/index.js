

var socket;
$(document).ready( function() {

    //This code will run after your page loads
    
  socket = io.connect('http://192.168.1.31:8082');
  var logger = document.getElementById('logger');
  
  if (window.DeviceOrientationEvent) {
    console.log("DeviceOrientation is supported");
    }
    
    
    // adding device orientation listener
    if (window.DeviceOrientationEvent){
    window.addEventListener("deviceorientation", function(event){
        var rotateDegress = event.alpha;
        var leftToRight = event.gamma;
        var frontToBack = event.beta;
        handleOrientationEvent(frontToBack, leftToRight, rotateDegress);
    
    }, false);
  }
                
 //adding device orientation handler 
  function handleOrientationEvent(z,x,o){
       var data = {
            z:(Math.round(z)),
            x:(Math.round(x)),
            o:(Math.round(o))
        };   
        

    var newz,newx,newo,oldz,oldx,oldo;
        var gate =false;
        if(gate===false)//fill 1st data
        {
        
            newz=z;
            newx=x;
            newo=o;
            gate=true;
            
        }
        else//fill 2nd data
        {
            oldz=z;
            oldx=x;
            oldo=o;
            gate=false;
        }
        if(oldz===null)
        {
            oldz,oldx,oldo=newz,newx,newo;
        }
        else
        {
            var deltaz=newz-oldz;
            var deltax=newx-oldx;
            var deltao=newx-oldo;
            if((Math.abs(deltaz)>200)||(Math.abs(deltax)>200)||(Math.abs(deltao)>200))
            {
                data={
                   z:(Math.round(oldz)),
                   x:(Math.round(oldx)),
                   o:(Math.round(oldo)),
                   
                };
            }
            else
            {
                data={
                    z:(Math.round(newz)),
                    x:(Math.round(newx)),
                    o:(Math.round(newo)),  
                }; 
            }
        }
            
         if (is_client.checked){
            //emit the devicemove event with the device data 
           
            
                socket.emit('devicemove', data);
            //move it locally
            
            moveBox(data);
            
        }
            
    }
    


  //obtaining orientation of device
  
    function moveBox(data){
        var front_hand = document.getElementById('front_hand'); 
        //var box = document.getElementById('box');
        //front_hand.style.webkitTransform = 'rotateZ('+data.z +'deg) rotateY('+data.o +'deg) rotateX('+data.x +'deg)';
        //front_hand.style.bottom = data.o + "px";
        front_hand.style.right = data.o + "px";
        console.log(data);
  }
  
  
    socket.on('srvupdate', function (data) {
      logger.style.color = '#22d332';
      logger.innerText = 'socket connected';
      
      
      
      socket.on('movesquare', function(data){
        moveBox(data);
      });

    socket.on('changepos', function(data){
        movePosition(data);
      });

      
    console.log(data);
    $("#socketstatus").text( data.data );
    //and clear it after a second
    setTimeout(function(){
        $("#socketstatus").text("");
    }, 1000);
    
 });
 
 
   $("#sendbutton").click( function() {
      socket.emit('clientupdate', { data: 'ping' });
  });
 
 

  
    // ====== Tried adding device motion support, Values kept averaging to Zero. GalaxyS4 doesn't support event.acceleration, attempted to adjust values to exclude gravity- no luck ===
    // adding device motion motion listener
    
//    if (window.DeviceMotionEvent) {
//      window.addEventListener('devicemotion', function(event){
//          var ax = event.accelerationIncludingGravity.x;
//          var ay = event.accelerationIncludingGravity.y;
//          var az = event.accelerationIncludingGravity.z;
//          handleMotionEvent(ax,ay,az);
//      }, false);
//    }
    
    // adding device motion handler
//    function handleMotionEvent(x,y,z) {
//        var data = {
//            x: (Math.round(x))*5,
//            y: (Math.round(y))*5,
//            z: (Math.round(z))*5
//        };
//        
//        
//        if (is_client.checked){
//            //emit the devicemotion event with the device data 
//                socket.emit('devicemotion', data);
//            //move it locally
//            movePosition(data);
//        }
//    }
    
        
    
    // obtaining motion of device
       // function movePosition(data){
        //var box = document.getElementById('box');
        //accelerate test 
     
        //box.style.bottom = data.y + "px";
        //box.style.right = data.x + "px";
        //console.log(data);
  //}
  
   // socket.on('devicemotion', function(data){
    //    movePosition(data);
    //  });
    
    
    //show what we got from the server
        

  //send a ping message to the server on click

});





        
        
