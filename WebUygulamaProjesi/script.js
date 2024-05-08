
let gorev_list=[]
if(localStorage.getItem("gorev_list") !== null){
    gorev_list = JSON.parse(localStorage.getItem("gorev_list"))
}

let editId;
let isEditTask = false;
const taskInput = document.querySelector("#txtTaskName")
const btnClear = document.querySelector("#btnClear")
const filters = document.querySelectorAll(".filters span")

displayTask(document.querySelector("span.active").id);

function displayTask(filter){

    let ul = document.getElementById("task-list")    
    ul.innerHTML = "" ;

    if(gorev_list.length == 0){
        ul.innerHTML="<p class = 'p-3 m-0'>Yorum Deposu Boş !</p>"
    }else
    {
        for(let gorev of gorev_list){
            let tamamlandi = gorev.durum == "tamamlanmis" ? "checked":"";
            if(filter == gorev.durum || filter == "all"){
                let li = `
            <li class="task list-group-item">
                <div class="form-check">
                    <input type="checkbox" onclick ="updateStatus(this)" id="${gorev.id}" class="form-check-input"${tamamlandi}>
                    <label for="${gorev.id}" class="form-check-label ${tamamlandi}">${gorev.adi}</label>
                </div>
                <div class="dropdown">
                    <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a onclick = "deleteTask(${gorev.id})" class="dropdown-item" href="#"> <i class="fa-solid fa-trash"></i> Sil</a></li>
                        <li><a onclick = 'editTask(${gorev.id},"${gorev.adi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
                    </ul>
                </div>
            </li> 
                `;
                ul.insertAdjacentHTML("beforeend",li)
            }
                
        }
    }
}

document.querySelector("#btnAddNewTask").addEventListener("click",newTask)
document.querySelector("#btnAddNewTask").addEventListener("keypress",function(){

    if(event.key == "Enter"){
        document.getElementById("btnAddNewTask").click()
    }

});

for(let span of filters){
    span.addEventListener("click",function(){
        document.querySelector("span.active").classList.remove("active")
        span.classList.add("active")
        displayTask(span.id)
    })
}

function newTask(event){

    if(taskInput.value == ""){alert("Yorum Girilmedi ! ")}
    else
    {
        if(!isEditTask){
            //ekleme
            gorev_list.push({"id" : gorev_list.length + 1 , "adi":taskInput.value,"durum":"tamamlanmamis"})
        }
        else{
            for(let gorev of gorev_list){
                if(gorev.id == editId){
                    gorev.adi = taskInput.value
                }
                isEditTask = false
            }
        }
        taskInput.value=""
        displayTask(document.querySelector("span.active").id)
        localStorage.setItem("gorev_list" , JSON.stringify(gorev_list))
    }
    
    event.preventDefault()
}

let deleteId;

function deleteTask(id){
    deleteId = gorev_list.findIndex(gorev => gorev.id == id)
    gorev_list.splice(deleteId,1)
    displayTask(document.querySelector("span.active").id);
    localStorage.setItem("gorev_list" , JSON.stringify(gorev_list))

}

function editTask(taskID,taskName){
    editId = taskID
    isEditTask = true
    taskInput.value = taskName
    taskInput.focus();
    taskInput.classList.add("active")

    console.log("edit id : " ,editId)
    console.log("edit mode : ",isEditTask)
}

btnClear.addEventListener("click",function(){

    gorev_list.splice(0,gorev_list.length)
    localStorage.setItem("gorev_list" , JSON.stringify(gorev_list))
    displayTask()
})

function updateStatus(selectedTask){
    //console.log(selectedTask.parentElement.lastElementChild)
    let label = selectedTask.parentElement.lastElementChild;
    let durum
    if(selectedTask.checked){
        label.classList.add("checked")
        durum = "tamamlanmis"

    }else{
        label.classList.remove("checked")
        durum = "tamamlanmamis"
    }
    for(let gorev of gorev_list ){
        if(gorev.id==selectedTask.id){
            gorev.durum=durum
        }
    }
    displayTask(document.querySelector("span.active").id)
    localStorage.setItem("gorev_list" , JSON.stringify(gorev_list))
}