let fill = '100';
let kot = '0';
let huq = '0';
let sakt = '0';


/* function luaj(){

    numri = Math.floor(Math.random() * 10); 
    $("#object").html(numri);
      
    document.getElementById("object").animate([
        // keyframes
        { transform: 'translateY(-500px)' }, 
        { transform: 'translateY(500px)' }
      ], { 
        // timing options
        duration: 6000,
        iterations: Infinity
      });
    
} */
 

function fillo() {       
    setTimeout(function() {  
        numri = Math.floor(Math.random() * 10); 
        $("#object").html(numri);
          
        document.getElementById("object").animate([
            // keyframes
            { transform: 'translateY(-500px)' }, 
            { transform: 'translateY(500px)' }
          ], { 
            // timing options
            duration: 6000,
            iterations: Infinity
          });
      fill--;
      $("#numra").html(fill);   
      if (fill > 0) {       
          fillo();           
      }                    
    }, 5000)
  }




/* function fillo() {       
  setTimeout(function() {  
    luaj();  
    fill--;
    $("#numra").html(fill);   
    if (fill > 0) {       
        fillo();           
    }                    
  }, 5000)
} */

function doSomethingWithX() {
    if (X == numri){
        sakt++;
        $("#teqelluar").html(sakt);
      } else {
        huq++;
        $("#huq").html(huq);
      }
}

var X = 0; 

document.addEventListener('keydown', (event) => {
  var keyName = event.key;  
  X =     keyName
  doSomethingWithX();
}, false);
    
