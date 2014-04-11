$(document).ready(function(){
    var clear = false;	
    $('.die').addClass('hidden');
    for(k = 1 ; k<=6 ; k++){
	$('#box').append($('<div/>').addClass('holder'+k).addClass('holder'));
    }
    
    var Holder = function(num){
	this.num = num;
	this.border = false;
	this.displayed = false;
	this.held = false;
	this.hold = function(){
	    if(this.border == true && !this.held){ 	
		$('.holder' + num).children().addClass('held');
		this.held = true;
	    }
	    else if(this.held && this.border)  {
		$('.holder' + num).children().removeClass('held');
		this.held = false;
	    }
	    else {
		$('.holder' + num).children('.die').addClass('clicked');
		setTimeout(function(){
		    $('.holder' + num).children('.die').removeClass('clicked');
		} , 100);
	    }		
	}
	
	this.display = function(count){
	    this.dotCount = count;
	    if (count == 0){
		this.displayed = false;
		this.border = false;
		this.held = false;
		$('.holder' + num).children().addClass('hidden').detach();
	    }
	    else{
		this.displayed = true;
		$('.holder' + num).children().addClass('hidden').detach();
		$('.holder' + num).append($('.die'+count+':eq(0)').clone(true , true).removeClass('hidden'));
	    }
	}
	
	this.addBorder = function(){
	    this.border = true;
	    $('.holder' + num).children().addClass('border');
	}	
    }
    
    Die = function(count){
	if(!count)
	    count = 0;
	this.count = count;
	this.held = false;
	this.isSet = false;
	this.draw = function(id){
	    var html = document.createElement('div');
	    html.className += ('die die'+count);
	    html.id = id;
	    for(var i=1;i<=count;i++){
		var dotNumbers = count.toString()+i.toString();
		var dot = '<div class="dot dot'+dotNumbers+'"/>';
		html.innerHTML += dot;
	    }
	    this.id = id;
	    return html;
	}
	this.hold = function(){
	    this.held = true;
	}
	this.unHold = function(){
	    this.held = false;
	}
	this.set = function(){
	    this.isSet = true;
	}
	this.unSet = function(){
	    this.isSet =false;
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
	    where.appendChild(html);
	}
	this.addDie = function(count){
	    if(!count)
		count = Math.floor(Math.random()*this.maxCount+1);
	    var die = new Die(count);
	    this.dice.push(die);
	    this.countDots();
	    var id = Math.round(Math.random()*1000000);
	    document.getElementById(this.id).appendChild(die.draw(id));
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
	    console.log(this.totalCount);
	    document.getElementById('count').innerHTML = this.totalCount;
	    return this.totalCount;
	}
	this.removeDie = function(index){
	    if(!index)
		index = this.dice.length-1;
	    var self = document.getElementById(this.id);
	    var child = document.getElementById(this.dice[index].id);
	    this.dice.splice(index,1);
	    self.removeChild(child);
	    this.countDots();

	}
	this.empty = function(){
	    for(var i=0;i<=this.dice.length+1;i++){
		this.removeDie();
	    }
	}
	    
    }
    b = new Board('b', 6);
    b.draw(document.body);
    b.addDie(1);
    b.addDie(3);
    b.addDie(4);
    c = new Board('c' , 3);
    c.draw(document.body);
    c.addDie();
    c.addDie();
    c.addDie();
/*    
    clearBoard = function(){
	var board = document.getElementById('new');
	while(board.firstChild) board.removeChild(board.firstChild);
    }
    
    insertDie = function(count){
	var die = new Die(count);
	document.getElementById('new').appendChild(die.make(count));
    }
*/    
    var h1 = new Holder(1);
    var h2 = new Holder(2);
    var h3 = new Holder(3);
    var h4 = new Holder(4);
    var h5 = new Holder(5);
    var h6 = new Holder(6);
    var h = [];

    for(var c = 1;c<=6;c++){
	h.push(eval("h"+c));
    }	

    function countDice(){
	var result = 0;
	h.forEach(function(holder){
	    if(holder.displayed == true){
		result++;
	    }
	});
	return result;
    }

    function addOneDie(){
	var count = countDice();
	if(count==6){
	    return;
	}	
	eval('h'+(count+1)).display(1);
    }
    function removeOneDie(){
	var count = 0;
	h.forEach(function(holder){
	    if(holder.displayed){
		count++;
	    }
	});
	if(count>0){
	    eval('h'+count).display(0);
	}
	updateDisplay();
    }
    function clearDice(){
	clear = true;
	h.forEach(function(holder){
	    holder.display(0);
	});
	
	setTimeout(function(){
	    removeOneDie();
	    $( '.die' ).each(function(){
		if(!$(this).hasClass('hidden')){
		    $(this).detach();
		}
	    });
	} , 0);
	updateDisplay();
    }

    function countDots(){
	var result = 0;
	var array = [];
	h.forEach(function(holder){
	    if (holder.displayed && !holder.held && holder.border) {
		array.push(holder);
	    }
	});	
	array.forEach(function(holder){
	    result+=holder.dotCount;
	});
	return result;
    }
    function countHeldDots(){
	var result = 0;
	h.forEach(function(holder){
	    if(holder.held == true && holder.displayed == true){
		result += holder.dotCount;
	    }
	});
	return result;
    }	
    function changeOneRandom(holder){
	var random = Math.floor(Math.random()*6+1);
	holder.display(random);
    }
    function rollOne(holder , rollTime){
	
	var timer = setInterval(function(){
	    if(clear == true){return;}
	    changeOneRandom(holder);
	} , 40);
	var timer2 = setTimeout(function(){
	    
	    clearInterval(timer);
	    holder.addBorder();
	} , rollTime)	;
	
    }

    function rollAll(){
	clear = false;
	var array = [];
	h.forEach(function(holder){
	    if(!holder.held && holder.displayed){
		array.push(holder);
	    }
	});
	
	array.forEach(function(holder , index){
	    if(clear == true){return;}
	    rollOne(holder , (index+1)*200);
	});
	
	var timer3 = setTimeout(function(){
	    updateDisplay();
	} , array.length *201);
    }	

    function updateDisplay(){
	var dotCountHeld = countHeldDots();
	var dotCountRolled = countDots();
	var total = dotCountHeld + dotCountRolled;
	if(total == 0){total = " ";}
	if (dotCountHeld == 0){
	    dotCountHeld = " ";
	    dotCountRolled = " ";
	}
	
  	$('#totaldisplay').html(total);
  	$('#helddisplay').html(dotCountHeld);
  	$('#rolleddisplay').html(dotCountRolled);
    }
    function clearDisplay(){
	$('#totaldisplay').html("");
  	$('#helddisplay').html('');
  	$('#rolleddisplay').html('');	
    }

    $(document).bind('keydown' , function(e){
	if(e.which == 67){clearDice();}
	if(e.which == 82){removeOneDie();}
	if(e.which == 65){addOneDie();}
	if(e.which == 84){countDots();}		
	if(e.which == 32){rollAll();}		
	
    });

    $('.die').click(function(){
	for(i=1 ; i<=6 ; i++){
	    if ($(this).parents().hasClass('holder'+i)){
		eval('h'+i+".hold()");
	    }
	}
	updateDisplay();
    });
    $('#test').bind('click' , function(){
	
    });
    $('#add').click(function(){
	addOneDie();

    });
    $('#remove').click(function(){
	removeOneDie();
    });
    $('#clear').click(function(){
	clearDice();
    })
    $('#roll').click(function(){
	rollAll();
    });
});

var addHolder;
var test;
