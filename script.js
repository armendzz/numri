let fill = '100';
let kot = '0';
let huq = '0';
let sakt = '0';
let X;

function luaj(){

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
    
}
 

function nisja() {       
  
      fill--;
      luaj();
      $("#numra").html(fill);  
  
  }

  
  

/* function fillo() {       
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
  } */




function fillo() {       
    luaj();
    $("#numra").html(fill);  
  setTimeout(function() {  
    luaj();  
    fill--;
    $("#numra").html(fill);   
    if (fill > 0) {       
        fillo();           
    }   

    if (X == undefined) {
      kot++
      $("#papergjigje").html(kot);  
    }
    X = undefined;
  }, 5000);
}

function doSomethingWithX() {

    if (X == numri){
        sakt++;
        $("#teqelluar").html(sakt);
       
      } else {
        huq++;
        $("#huq").html(huq);
      }
}


/* function verifiko(){
  if (X == numri){
    return true;
  } else {
    return false;
  }
} */



document.addEventListener('keydown', (event) => {
  var keyName = event.key;  
  X =     keyName
  doSomethingWithX();
 // verifiko()
}, false);
    
