/**
 * Created by bilashcse on 12/22/15.
 */

var Shoting = new Object();
Shoting.level = 1;
Shoting.bullet = 25;
Shoting.killed = 0;
Shoting.missed = 0;
Shoting.appeared = 0;
Shoting.context = null;

Shoting.find = function(value){
    return document.querySelector(value);
}

Shoting.start = function(){

    this.context = this.find(".main");

    this.context.style.top = ((window.innerHeight - this.context.offsetHeight) / 2)+"px";
    this.context.style.left = ((window.innerWidth - this.context.offsetWidth) / 2)+"px";

    this.bindEvent(this);
}

Shoting.createBird = function(){
    this.appeared++;
    if((this.killed % 5) == 0 && this.killed > 0){
        this.level++;
        this.bullet = this.bullet + 10;
        this.find("#level").innerHTML = "Level : "+this.level;
        this.find("#bullet").innerHTML = "Bullet : "+this.bullet+" left";
    }

    var elem = document.createElement("div");
    var classes = ["birdA","birdB","birdC"];
    var rand = Math.floor(Math.random() * 3);
    elem.className = classes[rand];
    console.log(elem.className);

    elem.style.top = 25 + Math.floor(Math.random() * 60)+"px";
    if(elem.className != "birdC"){
        elem.style.marginLeft = "170px";
        elem.style.backgroundSize = ((Math.random() * 20) + 28)+"px";
    }else{
        elem.style.marginLeft = "0px";
        elem.style.marginRight = "0px";
        elem.style.backgroundSize = "80px";
    }

    return this.context.appendChild(elem);
}

Shoting.bindEvent = function(scope){



    scope.find(".play-btn").onclick = function(){
        scope.level = 1;
        scope.bullet = 26;
        scope.killed = 0;
        scope.missed = 0;
        scope.appeared = 0;
        scope.find(".dashboard").style.display = "none";

        setTimeout(function(){

            scope.birdFly(scope);

        },(Math.random() * 2000) + 1000)

    }

    scope.birdFly = function(scope){
        var bird = scope.createBird();
        var flying = null;
        var falling = null;


        bird.onclick = function(e){
            scope.killed++;
            scope.find("#killed").innerHTML = "Killed : "+scope.killed+" birds";
            scope.find("#dead").currentTime = 0;
            scope.find("#dead").play();
            bird.className += " killed";
            clearInterval(flying);

            bird.style.webkitTransform = "rotate(45deg)";
            bird.style.webkitAnimation = "rotate infinite 700ms";

            if(bird.className == "birdC killed"){
                bird.style.backgroundImage = "url('birds/n/dead-bird.png')";
                bird.style.backgroundSize = "80px";

            }else{
                bird.style.backgroundImage =bird.className == "birdA killed" ? "url('birds/a3.png')" : "url('birds/b4.png')";

            }

            var main_top = 290;
            var rand_top = ((Math.random() * main_top) + 150);
            rand_top = rand_top > 290 ? 290 : rand_top;
            falling = setInterval(function(){

                var top = parseInt(bird.style.top.replace("px", "")) + 5;
                if (top > rand_top)
                {
                    bird.style.webkitAnimation = "none";
                    bird.style.webkitTransform = "rotate(180deg)";
                    clearInterval(falling);

                    setTimeout(function(){

                        scope.birdFly(scope);

                    }, (Math.random() * 5000));

                }else {
                    bird.style.top = top+"px";
                }

            }, 50);


        }

        flying = setInterval(function(){
            if(bird.className == "birdC"){
                var margin = parseInt(bird.style.marginRight.replace("px","")) + (scope.level + 4);

            }else{
                var margin = parseInt(bird.style.marginLeft.replace("px","")) + (scope.level + 4);

            }

            if(margin >scope.context.offsetWidth){
                clearInterval(flying);
                scope.missed++;
                scope.find("#missed").innerHTML = "Missed : "+scope.missed+" birds";
                scope.context.removeChild(bird);
                scope.birdFly(scope);

            }else{
                if(bird.className == "birdC"){
                    bird.style.marginRight = margin+"px";
                }else{
                    bird.style.marginLeft = margin+"px";
                }

            }

        },50);

        scope.context.onclick = function(e){
            if(scope.bullet > 0){

                scope.bullet--;
                scope.find("#bullet").innerHTML = "Bullet : "+scope.bullet+" left";
                scope.context.style.cursor = "url('images/shooted.png'),auto";

                // Reset Sound
                scope.find("#gunshot").currentTime = 0;
                scope.find("#reload").currentTime =0;


                scope.find("#gunshot").play();
                scope.find("#gunshot").onended = function(){
                    scope.find("#reload").play();
                }

                setTimeout(function(){
                    scope.context.style.cursor = "url('images/shoot.png'),auto";
                },200)
            }
            else{
                scope.find("#empty").currentTime = 0;
                scope.find("#empty").play();

                scope.find(".result").style.display = "block";
                scope.context.removeChild(bird);
                scope.find(".result_board").innerHTML = "<b>Hunter Game<b><br><br>Level Reached : "+scope.level+"<br>" +
                    "Bird Killed : "+scope.killed+"<br>Total Missed : "+scope.missed+" birds";
            }
        }



    }

}