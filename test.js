const { gpt } = require("gpti");

gpt.v1({
    messages: [
        {
            role: "assistant",
            content: "Hello! How are you today?"
        },
        {
            role: "user",
            content: "Hello, my name is Yandri."
        },
        {
            role: "assistant",
            content: "Hello, Yandri! How are you today?"
        }
    ],
    prompt: "Can you repeat my name?",
    model: "GPT-4",
    markdown: true
}, (err, data) => {
    if(err != null){
        console.log(err);
    } else {
        console.log(data);
    }
});