console.clear()


// const  header = document.getElementById("header");
// const  learn = document.getElementById("learn");
// const  contentCard = document.getElementById("content-card");
// const  faq = document.getElementById("faq");

// header.classList.remove("hidden")
// learn.classList.remove("hidden")
// contentCard.classList.remove("hidden")
// faq.classList.remove("hidden")




// Login 
document.getElementById("login").addEventListener("click",(event)=>{
    event.preventDefault()
    const userNameInput = document.getElementById("userName");
    const userPinInput = document.getElementById("userPin");
    const uName = userNameInput.value.trim();
    const uPin = userPinInput.value.trim();
    const convertPinToNumber = parseInt(uPin)
    // console.log( convertPinToNumber)
    if(uName!==""){
        if(uPin!==""){
            if(uPin.length === 6){
                if(convertPinToNumber === 123456){
                    const  header = document.getElementById("header");
                    const  learn = document.getElementById("learn");
                    const  contentCard = document.getElementById("content-card");
                    const  faq = document.getElementById("faq");
                    const  hero = document.getElementById("hero");
                    header.classList.remove("hidden")
                    learn.classList.remove("hidden")
                    contentCard.classList.remove("hidden")
                    faq.classList.remove("hidden")
                    hero.classList.add("hidden")
                    userNameInput.value = "";
                    userPinInput.value = "";
                    // sweet alert
                    Swal.fire({
                    title: "Login Successful",
                    icon: "success"
                    });
                }
            }else{
                Swal.fire("You must enter six digit.");
            }
        }else{
            Swal.fire("Password Field is Empty");
        }
    }else{
        Swal.fire("Username Field is Empty");
    }
    console.log(uName)
})
// header nav active
function headerAc(val){
    console.log(val)
    const acNav = document.getElementsByClassName("active")
    for(let item of acNav){
        item.classList.remove("active");
    }
    const hNav = document.getElementById(`${val}`)
    hNav.classList.add("active")
}
const spin =document.getElementById("loading-span")
spin.classList.remove("invisible")
// append all laver in a nav button
fetch("https://openapi.programming-hero.com/api/levels/all").then((res)=>res.json()).then((data)=>{
    loadLevel(data.data)
    spin.classList.add("invisible")
})
function loadLevel(allLevel){
    const nav = document.getElementById("all-level");
    allLevel.forEach(element => {
        // console.log(element)
        nav.innerHTML += `
        <button id="lvl-btn-${element.level_no}" onclick="getLvlId(${element.level_no})" class="btn bg-white border text-blue-700 border-blue-700 hover:bg-blue-600 hover:text-white">${element.lessonName}</button>
        `;
    });
}

// show data select nav level
function getLvlId(levelID){
    const activeBtn =document.getElementsByClassName("active")
    for(let item of activeBtn){
        console.log(item, "active")
        item.classList.remove("active")
    }
    const btn =document.getElementById(`lvl-btn-${levelID}`)
    
    spin.classList.remove("invisible")
    btn.classList.add("active")
    console.log(btn)
    fetch(`https://openapi.programming-hero.com/api/level/${levelID}`).then((response)=>response.json()).then((data)=>{
        contentData(data.data)
        spin.classList.add("invisible")})
}
//get data from fetch to append in container
function contentData(levelData){
    const  contentCard = document.getElementById("content-card");
    contentCard.innerHTML = "";
    if(levelData.length === 0){
        contentCard.innerHTML = `
        <div class="col-span-3 text-center flex flex-col items-center">
            <img class="w-28" src="./assets/alert-error.png" alt="">
            <p class="text-xl p-3">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।।</p>
            <h2 class="text-3xl font-medium p-3">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        return
    }
    for(i=0; i<levelData.length; i++){
        contentCard.innerHTML += `
        <div class="p-4 bg-white rounded-md border border-gray-300 shadow-md">
            <div class="text-center p-3 hover:bg-sky-100 hover:shadow-md hover:rounded-md transition duration-400 cursor-pointer">
                <h2 class="text-3xl py-2">${levelData[i].word === null || levelData[i].word === "" ? `<span class="text-red-500">অর্থ নেই</span>` : levelData[i].word }</h2>
                <p class="py-2 text-xl">Meaning /Pronunciation</p>
                <h2 class="text-xl py-2 truncate">${levelData[i].meaning === null || levelData[i].meaning === "" ? `<span class="text-red-500">অর্থ নেই</span>` : levelData[i].meaning } / ${levelData[i].pronunciation === null || levelData[i].pronunciation === "" ? `<span class="text-red-500">শব্দ নাই</span>` : levelData[i].pronunciation }</h2>
                <div class="flex justify-between items-center text-lg pt-5">
                    <button onclick="detailsModal(${levelData[i].id})" class="bg-gray-300 p-3 rounded-md cursor-pointer"><i class="fa-solid fa-eye"></i></button>
                    <button onclick="pronounceWord('${levelData[i].word}')" class="bg-gray-300 p-3 rounded-md cursor-pointer"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        </div>
        `;
    }
}
// voice setup
function pronounceWord(word) {
    console.log(word)
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN'; // English
    window.speechSynthesis.speak(utterance);
}


// details view on modal
function detailsModal(contentId){
    const modal = document.getElementById("details_modal").showModal();
    fetch(`https://openapi.programming-hero.com/api/word/${contentId}`).then((res)=>res.json()).then((data)=>addToModal(data.data))
}
function addToModal(details){
    console.log(details)
    console.log(details.synonyms.length)
    let synonymWord = "";
    console.log(typeof details.meaning)
    if(details.synonyms.length !== 0){
        details.synonyms.forEach(item=>{
            synonymWord += `<p class="py-2 px-4 rounded-sm bg-sky-100">${item}</p>`
        })
    }
    console.log(synonymWord.length,"----")
    const mBox = document.getElementById("modalBox");
    mBox.innerHTML = `
    <div class="border border-sky-200 rounded-md p-4">
        <h3 class="text-2xl font-bold">${details.word === null || details.word === "" ? `<span class="text-red-500">শব্দটি নাই</span>` : details.word } (<i class="fa-solid fa-microphone-lines"></i> : ${details.pronunciation === null || details.pronunciation === "" ? `<span class="text-red-500">শব্দটি নাই</span>` : details.pronunciation })</h3>
        <div class="pb-4">
            <p class="text-lg py-2">Meaning</p>
            <p >${details.meaning === null || details.meaning === "" ? `<span class="text-red-500">শব্দটির অর্থ পাওয়া যায়নি</span>` : details.meaning }</p>
        </div>
        <div class="pb-4">
            <p class="text-lg py-2">Example</p>
            <p >${details.sentence === null || details.sentence === "" ? `<span class="text-red-500">কোন বাক্য পাওয়া যায়নি</span>` : details.sentence }</p>
        </div>
        <p class="py-2">সমার্থক শব্দ গুলো</p>
        <div class="flex items-center gap-4">${synonymWord.length !== 0 ? synonymWord : `<span class="text-red-500">কোন শব্দ পাওয়া যায়নি</span>`}</div>
    </div>
    <form method="dialog">
        <button id="login" type="submit" class="bg-blue-500 text-white mt-5 px-4 py-2 rounded-md hover:bg-blue-800 transition active:scale-98 cursor-pointer">Complete Learning</button>
    </form>
    `
}


