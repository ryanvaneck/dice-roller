document.addEventListener("DOMContentLoaded", function() {

    Die = function(count){
	if(!count)
	    count = 0;
	this.count = count;
	this.held = false;
	this.isSet = false;
	this.draw = function(id){
	    var html = document.createElement('div');
	    html.className = ('die die'+this.count);
	    //html.setAttribute('onclick' , this.id + '.toggleHold()');
	    if(id) html.id = id;
	    if(count < 7){
		for(var i=1;i<=this.count;i++){
		    var dotNumbers = this.count.toString()+i.toString();
		    var dot = '<div class="dot dot'+dotNumbers+'"/>';
		    html.innerHTML += dot;
		}
	    }
	    else{
		html.innerHTML = "<p class='dieNumber'>"+count.toString()+"</p>";
	    }
	    this.id = id;
	    return html;
	}
	this.hold = function(){
	    if(this.isSet == true){
		this.held = true;
		document.getElementById(this.id).classList.add('held');
		this.board.countDots();
		console.log('holding');
	    }
	}
	this.unHold = function(){
	    this.held = false;
	    document.getElementById(this.id).classList.remove('held');
	    console.log('unholding')
	    this.board.countDots();
	    
	}
	this.toggleHold = function(){
	    if(this.held == true){
		this.unHold();
	    }
	    else{
		this.hold();
	    }
	}
	this.set = function(){
	    this.isSet = true;
	    document.getElementById(this.id).classList.add('border');
	}
	this.unSet = function(){
	    this.isSet =false;
	    document.getElementById(this.id).classList.remove('border');
	}
	this.changeCount = function(newCount){
	    this.count = newCount;
	}
    }

    Board = function(id,maxCount){
	this.maxCount = maxCount;
	this.id = id;
	this.totalCount = 0;
	this.heldCount = 0;
	this.dice = [];
	this.draw = function(where){
	    var html = document.createElement('div');
	    html.className = 'board';
	    html.id = this.id;
	    var inner =  "<div id='"+this.id+"-counts' class='countBox'>";
	    inner +="<span>total:</span><div  id='"+this.id+"-totalCount'></div>";
	    inner +="<span>held:</span><div id='"+this.id+"-heldCount'></div></div>";
	    inner += "<div class='controls' id='"+this.id+"-controls'>";
	    inner += "<button id='"+this.id+"'-roll' onclick='"+this.id+".rollAll(40)'>Roll</button>";
	    inner += "<button id='"+this.id+"'-clearAll' onclick='"+this.id+".empty()'>Clear All</button>";
	    inner += "<button id='"+this.id+"'-addOne' onclick='"+this.id+".addDie()'>Add One</button>";
	    inner += "<button id='"+this.id+"'-clearOne' onclick='"+this.id+".removeDie()'>Clear One</button></div>";
	    inner += "<div class='clearfix'></div>";
	    html.innerHTML = inner;
	    where.appendChild(html);
	}
	this.addDie = function(count){
	    if(!count)
		count = Math.floor(Math.random()*this.maxCount+1);
	    var die = new Die(count);
	    die.board = this;
	    this.dice.push(die);
	    var id = 'die'+Math.round(Math.random()*1000000);
	    document.getElementById(this.id).appendChild(die.draw(id));
	    this.countDots();
	    document.getElementById(id).addEventListener('click' , function(){
		die.toggleHold();
	    });
	    return this;
	}
	
	this.countDots = function(){
	    var count = 0;
	    var heldCount = 0;
	    this.dice.forEach(function(die){
		count += die.count;
		if(die.held == true) 
		    heldCount += die.count;
	    });
	    this.totalCount = count;
	    this.heldCount = heldCount;
	    //console.log(this.totalCount+ '  '+ this.heldCount);
	    document.getElementById(this.id + '-totalCount').innerHTML = this.totalCount;
	    document.getElementById(this.id + '-heldCount').innerHTML = this.heldCount;
	    var boardEl = document.getElementById(this.id);
	    var boardChildren = boardEl.children;
	    for(var i=0;i<boardChildren.length;i++){
		if(boardChildren[i].classList.contains('clearfix'))
		    boardEl.appendChild(boardChildren[i]);
	    }
	    return this.totalCount;

	}
	this.removeDie = function(index){
	    if(index==undefined)
		index = this.dice.length-1;
	    var self = document.getElementById(this.id);
	    var id = this.dice[index].id;
	    var child = document.getElementById(id);
	    var removed = this.dice.splice(index,1);
	    self.removeChild(child);
	    this.countDots();
	    return this;
	}
	this.empty = function(){
	    while(this.dice.length >0){
		this.removeDie();
	    }
	    return this
	}
	this.changeOneDie = function(index){
	    if(index > this.dice.length-1){
		console.log('tried to change out of range');
		return;
	    }
	    var die = this.dice[index];
	    var random = Math.floor(Math.random()*this.maxCount)+1;
	    die.changeCount(random);
	    var old = document.getElementById(die.id);
	    /*
	    while(old.children)
		old.removeChild(old.firstChild)*/
	    for(var i=0;i<=old.children.length;i++){
		old.removeChild(old.firstChild)
	    }
	    var newInner = die.draw(die.id).innerHTML;
	    old.innerHTML = newInner;
	    this.countDots;
	    return (this);
	    /*var parent = old.parentNode;
	    parent.replaceChild(die.draw(die.id),old);
	    this.countDots();
	    return (this);*/
	}
	
	this.rollOne =  function(index,rollTime){
	    var $this = this
	    var timer = window.setInterval(function(){
		if($this.dice[index].held == false)
		    $this.changeOneDie(index);
	    } , 40);
	    var timer2 = setTimeout(function(){
		clearInterval(timer);
		if($this.dice[index].held == false)
		    $this.dice[index].set();
	    } , rollTime);
	}
	
	this.rollAll = function(rollTime){
	    var board = this;
	    var countDice = 0
	    this.dice.forEach(function(die,index){
		board.rollOne(index,rollTime+index*100);
	    });
	}
}
    b = new Board('b', 6);
    b.draw(document.body);
    b.addDie(1);
    b.addDie(2);
    b.addDie(3);
    c = new Board('c',6);
    c.draw(document.body);
    c.addDie(3);
    c.addDie(2);
    c.addDie(1);
/*
t = function(){
    [].forEach.call(document.querySelectorAll('.die'), function(el) {
	function clickHold(){
	    console.log('click');
	    var boardId = el.parentNode.id;
	    var dieId = el.id;
	    console.log(dieId);;
	    eval(boardId).dice.forEach(function(die){
		if(die.id == dieId){
		    die.toggleHold();
		}
	    });
	}
	el.removeEventListener('click' , clickHold);
	el.addEventListener('click', clickHold);
    }); 
    console.log('ran t()');
}
*/

});
var doc = document;
