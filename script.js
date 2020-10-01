let fill = '5';
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
 

/* function nisja() {       
  
      fill--;
      luaj();
      $("#numra").html(fill);  
  
  }
 */
  
  

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
    if(fill > 0){
  luaj();
  $("#numra").html(fill);  
 /*  if (X == undefined) {
    kot =+ 0.5;
    $("#papergjigje").html(kot);  
  }
  X = undefined;  */

  /* if (fill == 0  && X == undefined) {
    console.log("futja +1")
  } */
      function tash() {  
            luaj();  
            fill--;
            $("#numra").html(fill);   
            if (fill >= 0) {       
                fillo();           
            }  else {
              lojambaroi();
           }

           
            if (X == undefined) {
              kot++;
              $("#papergjigje").html(kot); 
            //  fill--; 

            if (fill == 1 ) {
              kot++
            }
            }


            X = undefined;
      }
  timer = setTimeout(tash, 5000)
 } else {
  lojambaroi();
 }
}

function doSomethingWithX() {

    if (X == numri){
        sakt++;
        $("#teqelluar").html(sakt);
       clearTimeout(timer);
       fill--;
       X = undefined;
       fillo()
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
    
function lojambaroi (){

 /*  if (X == undefined) {
    kot++
  } */
  clearTimeout(timer);
  $("#gameover").addClass('d-none')
  $("#rezultati").removeClass('d-none')
  $("#rezultatiteqelluar").html(sakt)
  $("#rezultatihuq").html(huq)
  $("#rezultatipapergjigje").html(kot)

  
}