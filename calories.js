var EventEmitter = require('events');
var prompt = new EventEmitter();
var current = null;
var result = {};
var gender_add_to_WHY = {
    1: 5,
    2: -161
};
var coefficient = {
    0: 1,
    1: 1.2,
    2: 1.35,
    3: 1.55,
    4: 1.75,
    5: 1.99,
};

process.stdin.resume();

// inputing data event
process.stdin.on('data', function(data){
    let str_data = data.toString().trim();
    if(str_data == 'quit' || str_data == 'exit'){
        process.stdin.pause();
        return;
    }

    prompt.emit(current, str_data);
});

// show new input event
prompt.on(':new', function(param, question){
    current = param;
    console.log(question);
    process.stdout.write('> ');
});

// ending event
prompt.on(':end', function(){
    let bmr = 9.99*result.weight + 6.25*result.height - 4.92*result.age + gender_add_to_WHY[result.gender];
    console.log('\n', 'Optimal calories level = ' + (bmr * coefficient[result.load_level]));
    process.stdin.pause();
});

// input weight
prompt.emit(':new', 'weight', 'Your weight, kg?');

// inserting param into results
prompt.on('weight', function(data){
    result.weight = Number(data);
    // input height
    prompt.emit(':new', 'height', 'Your height, sm?');
});

// inserting param into results
prompt.on('height', function(data){
    result.height = Number(data);
    // input age
    prompt.emit(':new', 'age', 'Your age, years?');
});

// inserting param into results
prompt.on('age', function(data){
    result.age = Number(data);
    // input gender
    prompt.emit(':new', 'gender', 'Your gender, years?' + "\r\n 1 - man, 2 - woman");
});

// inserting param into results
prompt.on('gender', function(data){
    let gender = Number(data);
    if(gender !== 1 && gender !== 2){
        console.log("error, 1 - man, 2 - woman");
        process.stdout.write('> ');
    }else{
        result.gender = gender;
        // input load_level
        prompt.emit(':new', 'load_level', 'Your load level?' + "\r\n 1 - minimum, 2 - light, 3 - middle, 4 - high, 5 - extreme");
    }
});

// inserting param into results
prompt.on('load_level', function(data){
    let load_level = Number(data);
    if(load_level < 1 || load_level > 5 || !Number.isInteger(load_level)){
        console.log("error, 1 - minimum, 2 - light, 3 - middle, 4 - high, 5 - extreme");
        process.stdout.write('> ');
    }else{
        result.load_level = load_level;
        prompt.emit(':end');
    }
});