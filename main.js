let countspan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let results = document.querySelector(".result");
let countDownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswer = 0;
let countDowenInterval;
let duration = 10;


function createBullets(num){
    countspan.innerHTML = num;

    for(let i = 0; i < num ; i++){
        //creat span
        let theBullet = document.createElement("span");
        if(i === 0){
            theBullet.className = "on";
        }
        //append bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj,count){
   
    if(currentIndex < count){
        //creat h2 question title
        let questionTitle = document.createElement("h2");
        //creat question text
        let questionText = document.createTextNode(obj.title);

        //append text to h2
        questionTitle.appendChild(questionText);

        //append quetion title to quiz area
        quizArea.appendChild(questionTitle);

        //create the answers
        for (let i = 1 ; i <= 3 ; i++){
            //creat main Answer div
            let mainDiv = document.createElement("div");

            //add class to main div

            mainDiv.className = 'answer';

            //craet radio input
            let radioInput = document.createElement("input");
            //Add type + name +id + data-attrubte

            radioInput.name ="question";
            radioInput.type ="radio";
            radioInput.id =`answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            //Make firste option selected 
            if (i == 1){
                radioInput.checked = true;
            }

            //creat label
            let theLable = document.createElement("label");

            //add for attribute 
            theLable.htmlFor = `answer_${i}`;

            //creat lable text
            let theLableText = document.createTextNode(obj[`answer_${i}`]);

            //add the text to lable
            theLable.appendChild(theLableText);

            // add the input + lable to main div 
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLable);

            //add main div to answers-area

            answerArea.appendChild(mainDiv);
        }
    }

}

function checkAnswer(rAnswer,qCount){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer ;

    for(let i = 0 ; i < answers.length; i++){
        if(answers[i].checked){
           theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (theChoosenAnswer === rAnswer){
        rightAnswer ++;  
    }
}

function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpan = Array.from(bulletsSpans);
    arrayOfSpan.forEach((span,index)=>{
        if(currentIndex === index )
            span.className ="on";
    })
}


function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswer > (count/2) && rightAnswer <count){
            theResults = `<span class="good">Good</span>, ${rightAnswer} from ${count} Is Good`;

        }else if (rightAnswer === count){
            theResults = `<span class="perfect">perfect</span>, ${rightAnswer} from ${count} Is Good`;

        }else{
            theResults = `<span class="bad">bad</span>, ${rightAnswer} from ${count}`;

        }
        results.innerHTML = theResults;
    }

    
}


function countdown(duration , count){
    if(currentIndex < count){
        let minutes, seconds ;
        countDowenInterval = setInterval(function(){
            
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownElement.innerHTML = `${minutes}:${seconds}`;
            
            if(--duration < 0){
                clearInterval(countDowenInterval);
                submitButton.click();
            }
        },1000);
    }
}


function getQuestions(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status === 200){
           
            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length;


            createBullets(qCount)

            //Add data
            addQuestionData(questionObject[currentIndex],qCount);
            //start countdown
            countdown(duration , qCount);
            //click on submit 

            submitButton.onclick = () =>{
                //get right answer
                let theRightAnswer = questionObject[currentIndex].right_answer;

                //incrase index

                currentIndex ++;

                //check the answer
                checkAnswer(theRightAnswer,qCount)

                //remove Previous Question

                quizArea.innerHTML ='';
                answerArea.innerHTML ='';

                //Add next question
                 addQuestionData(questionObject[currentIndex],qCount);

                //handle bullets class
                handleBullets();

                clearInterval(countDowenInterval)
                countdown(duration , qCount);

                //show results
                showResults(qCount);

            }
        }
    }
    myRequest.open("GET","html_question.json",true);
    myRequest.send();

}


getQuestions();