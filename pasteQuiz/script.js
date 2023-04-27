function parseData() {
  alert("IN");
let data = []
  const text = document.getElementById("paste").value;
  var line = text.split(/\n/)
  for(let i =0; i<line.length; i+=5){
    let question = 
    { 
      type: "MCQ",
      question: line[i], 
      a:line[i+1],
      b:line[i+2],
      c:line[i+3],
      d: line[i+4],
      answer: ""
    }
    data.push(question);
  }
  const list = document.getElementById("questions");
  list.innerText = "";
  data.forEach(element => {
    let q = document.createElement('li');
    q.innerText = element.question
    list.append(q);

    let choices = document.createElement('div');
    let o1 = document.createElement('div');
    o1.innerText = "A. " + element.a;
    let o2 = document.createElement('div');
    o2.innerText = "B. " +element.b;
    let o3 = document.createElement('div');
    o3.innerText = "C. " +element.c;
    let o4 = document.createElement('div');
    o4.innerText = "D. " +element.d;
    choices.append(o1);choices.append(o2);choices.append(o3);choices.append(o4);
    q.append(choices);
    
    let buttons = document.createElement('div');
    let answer = document.createElement('div');
    buttons.innerText = "Choose Correct Answer: "
    let a = document.createElement('button')
    a.value = "a";
    a.innerText = "A";
    a.onclick = ()=>{
      element.answer = a.value;
      o1.style.backgroundColor = "lightGreen"
      o2.style.backgroundColor = ""
      o3.style.backgroundColor = ""
      o4.style.backgroundColor = ""
    }
    let b = document.createElement('button')
    b.value = "b";
    b.innerText = "B";
    b.onclick = ()=>{
      element.answer = b.value;
      o1.style.backgroundColor = ""
      o2.style.backgroundColor = "lightGreen"
      o3.style.backgroundColor = ""
      o4.style.backgroundColor = ""
    }
    let c = document.createElement('button')
    c.value = "c";
    c.innerText = "C";
    c.onclick = ()=>{
      element.answer = c.value;
      o1.style.backgroundColor = ""
      o2.style.backgroundColor = ""
      o3.style.backgroundColor = "lightGreen"
      o4.style.backgroundColor = ""
    }
    let d = document.createElement('button')
    d.value = "d";
    d.innerText = "D";
    d.onclick = ()=>{
      element.answer = d.value;
      o1.style.backgroundColor = "none"
      o2.style.backgroundColor = "none"
      o3.style.backgroundColor = "none"
      o4.style.backgroundColor = "lightGreen"
    }
    buttons.append(a);buttons.append(b);buttons.append(c);buttons.append(d);
    q.append(buttons);
    
    
    
});

  console.log(data);
}