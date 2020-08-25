
let dictionnary = [];

// Function to read the file
function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];

    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            mainEntry(contents);
        }
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }


}
document.getElementById('fileinput').addEventListener('change', readSingleFile, false);

// file filtered
function mainEntry(fileContentLoaded) {
    var splitContent = fileContentLoaded.split("\n");
    //calling function to ignore all words with non-alphabetical characters
    let dictionnaryFiltered = filterWords(splitContent);
    //Create an array of objects Words
    for(let word of dictionnaryFiltered){
        dictionnary.push(splitOnSpace(word));
    }
    return dictionnary;
}

function filterWords(splitContent){
    let regex = /[$&+,:;=?@#|<>.^*()%!-"]/;
    let values = splitContent.filter(x => { 
        return !(x.match(regex))     
    });
    return values;
}

//Create an object to store the word and the pronunciation from the dictionary
function splitOnSpace(s) {
    var obj = {
        name: "",
        pronunciation: ""
    }
    // accumulate before space
    var i = 0;
    while (i < s.length && s[i] != " ") { obj.name += s[i]; i++; }
    // skip the space
    i++;
    // accumulate after space
    while (i < s.length) { obj.pronunciation += s[i]; i++; }
    return obj;
}

// Find the word information
function search(){
    // input with case insensitive
    let userInput = (document.getElementById("userInput").value).toUpperCase();
    let W = {
        name:"",
        pronunciation:"",
        identical: [],
        replace :[],
        add:[],
        remove:[]
    };
    //Loop in the dictionnary to find words that matched with the input
    for(word of dictionnary){
        if(userInput == word.name){
            W.name = word.name;
            W.pronunciation = word.pronunciation.trim();
            W.identical = findSamePronunciation(W);
            let siblings = replacePhoneme(W.pronunciation);
            W.replace = siblings.replace;
            W.add = siblings.add;
            W.remove = siblings.remove;

            printObject(W);
            break;
        }
        else{
            document.getElementById("result").innerHTML = "NOT FOUND";
            document.getElementById("pronunciation").innerHTML = " ";
            document.getElementById("identical").innerHTML = " ";
            document.getElementById("add").innerHTML = " ";
            document.getElementById("replace").innerHTML = " ";
            document.getElementById("remove").innerHTML = " ";
        }
    }
    return false;
}

function findSamePronunciation(input){
    let matched = [];

    // The trim() method removes whitespace from both ends of a string
    for(word of dictionnary){
        if(input.pronunciation == word.pronunciation.trim() && input.name != word.name){
            matched.push(word.name);
        }
        else{
            document.getElementById("result").innerHTML = "NOT FOUND";
        }
    }
    return matched;
}

function replacePhoneme(input){
    let inputPhonemes = input.split(" ");
    let countSamePhonemes = 0;
    let diff = 0;
    let siblings = {
        replace:"",
        add:"",
        remove:""
    };
    
    for(word of dictionnary){
        let wordPhonemes = (word.pronunciation.trim()).split(" ");

        //replace 
        if(wordPhonemes.length == inputPhonemes.length){
            for(let i = 0 ; i < (inputPhonemes.length) ; i++){
                if(inputPhonemes[i] == wordPhonemes[i]){
                    countSamePhonemes++;
                }
            }
            if(countSamePhonemes == (inputPhonemes.length)-1){
                siblings.replace += word.name + " ";
                
            }
        }

        // add
        if(wordPhonemes.length == inputPhonemes.length+1){
            let j = 0;
            for(let i = 0 ; i < (inputPhonemes.length) ; i++){
                if(inputPhonemes[i] == wordPhonemes[j]){
                    countSamePhonemes++;
                }
                else if(inputPhonemes[i] == wordPhonemes[j+1]){
                    diff++;
                    j++;
                    countSamePhonemes++;
                    if(diff >= 2){
                        break;
                    }
                }
                j++;
            }
            diff= 0;
            if(countSamePhonemes == (inputPhonemes.length) ){
                siblings.add += word.name + " ";
            }
        }

        //remove 
        if(wordPhonemes.length == inputPhonemes.length -1  ){
            let j = 0;
            for(let i = 0 ; i < (wordPhonemes.length) ; i++){
                if(wordPhonemes[i] == inputPhonemes[j]){
                    countSamePhonemes++;
                }
                else if(wordPhonemes[i] == inputPhonemes[j+1]){
                    diff++;
                    j++;
                    countSamePhonemes++;
                    if(diff >= 2){
                        break;
                    }
                }
                j++;
            }
            diff= 0;
            if(countSamePhonemes == (wordPhonemes.length) ){
                siblings.remove += word.name + " ";
            }
        }
        count = 0;
        countSamePhonemes = 0;
    }

    return siblings;
}

// Print Object when the word is found
function printObject(word){
    document.getElementById("result").innerHTML = word.name;
    document.getElementById("pronunciation").innerHTML = word.pronunciation;
    document.getElementById("identical").innerHTML = word.identical;
    document.getElementById("replace").innerHTML = word.replace;
    document.getElementById("add").innerHTML = word.add;
    document.getElementById("remove").innerHTML = word.remove;
}







