const API_KEY = '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';
const sendButton = document.getElementById('sendButton');
const chatInput = document.getElementById('chatInput');
const content = document.getElementById('content');
let isAnswerLoading = false;
let answerSectionId = 0;

sendButton.addEventListener('click', () => handleSendMessage());
chatInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});

function handleSendMessage() {
    const question = chatInput.value.trim();
    if (question === '' || isAnswerLoading) return;
    sendButton.classList.add('send-button-nonactive');
    addQuestionSection(question);
    chatInput.value = '';
}

function getAnswer(question) {
    const fetchData = fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "deepseek/deepseek-r1-distill-llama-70b:free",
            "messages": [
                {
                    "role": "user",
                    "content": question
                }
            ]
        })
    });

    fetchData
        .then(response => response.json())
        .then(data => {
            if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                const resultData = data.choices[0].message.content;
                isAnswerLoading = false;
                addAnswerSection(resultData);
            } else {
                isAnswerLoading = false;
                addAnswerSection("Sorry, I couldn't fetch a response. Your daily chat limit might've been exceeded. Please try again later");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            isAnswerLoading = false;
            addAnswerSection("Something went wrong. Please check your internet or API key.");
        })
        .finally(() => {
            scrollToBottom();
            sendButton.classList.remove('send-button-nonactive');
        });
}

function addQuestionSection(message) {
    isAnswerLoading = true;
    const sectionElement = document.createElement('section');
    sectionElement.className = 'question-section';
    sectionElement.textContent = message;
    content.appendChild(sectionElement);
    addAnswerSection(message);
    scrollToBottom();
}

function addAnswerSection(message) {
    if (isAnswerLoading) {
        answerSectionId++;
        const sectionElement = document.createElement('section');
        sectionElement.className = 'answer-section';
        sectionElement.innerHTML = getLoadingSvg();
        sectionElement.id = answerSectionId;
        content.appendChild(sectionElement);
        getAnswer(message);
    } else {
        const answerSectionElement = document.getElementById(answerSectionId);
        if (answerSectionElement) {
            answerSectionElement.textContent = message;
        }
    }
}

function getLoadingSvg() {
    return `<svg style="height: 25px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" r="15" cx="40" cy="100"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" r="15" cx="100" cy="100"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" r="15" cx="160" cy="100"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>`;
}

function scrollToBottom() {
    content.scrollTo({
        top: content.scrollHeight,
        behavior: 'smooth'
    });
}