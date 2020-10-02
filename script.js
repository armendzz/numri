let fill = '100';
let kot = '0';
let huq = '0';
let sakt = '0';
let X;

function luaj(){
    numri = Math.floor(Math.random() * 10); 
    $("#object").html(numri);
      
    document.getElementById("object").animate([
        { transform: 'translateY(-500px)' }, 
        { transform: 'translateY(500px)' }
      ], { 
        duration: 6000,
        iterations: Infinity
      });
    
}
 
function fillo() {       
    if(fill > 0){
  luaj();
  $("#numra").html(fill);  
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

function verifiko() {

    if (X == numri){
        $("#plusnjesakt").removeClass('d-none');
        sakt++
        $("#teqelluar").html(sakt);
       clearTimeout(timer);
       fill--;
       X = undefined;
       fillo()
        setTimeout(function(){
          $("#plusnjesakt").addClass('d-none')
          $("#plusnjesakt").removeAttr('style');
        }, 800)
          $("#plusnjesakt").animate({
            width: "70%",
            opacity: 0.4,
            marginLeft: "0.6in",
            borderWidth: "10px"
          }, 500 );
        

      } /* else if ( X = undefined ){
        kot++;
        $("#papergjigje").html(kot); 
     
      } */ else {
        huq++;
        $("#huq").html(huq);
        $("#object").addClass('gabim')
        $("#plusnjehuq").removeClass('d-none');
        $("#plusnjehuq").animate({
          width: "70%",
          opacity: 0.4,
          marginLeft: "-0.6in",
          borderWidth: "10px"
        }, 500 );
       
      }
}

document.onkeydown = function() {
    if ( this.className === 'hold' ) { return false; }
    this.className = 'hold';
    let keyName = event.key;  
    X = keyName
    verifiko();
};

document.onkeyup = function() {
  this.className = '';
  if (X !== numri) {
    $("#object").removeClass('gabim')
    setTimeout(function(){
      $("#plusnjehuq").addClass('d-none')
      $("#plusnjehuq").removeAttr('style');
    }, 800)
   
  } 
  
};

    
function lojambaroi (){
  clearTimeout(timer);
  $("#gameover").addClass('d-none')
  $("#rezultati").removeClass('d-none')
  $("#rezultatiteqelluar").html(sakt)
  $("#rezultatihuq").html(huq)
  $("#rezultatipapergjigje").html(kot)  
}
