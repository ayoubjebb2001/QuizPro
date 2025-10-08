document.addEventListener("DOMContentLoaded", () => {
    let DeleteBtns = document.querySelectorAll('.btn-delete');
    DeleteBtns.forEach(button => {
        button.addEventListener('click', async () => {
            let QuestionId = button.dataset.id;
            try{
           let QuestionId = button.dataset.id;   
           const response=await fetch(`/question/delete/${QuestionId}`,{
method:"DELETE"
           })  

 if (!response.ok) {

      throw new Error(`HTTP error! Status: ${response.status}`);
    }
   
       location.reload();
    
            }
            catch(error){
             console.error(`Erreur  : ${error.message}`);   
            }
        });
    });
});
// parti de modification:
document.addEventListener("DOMContentLoaded",()=>{

    let UpdateBtns=document.querySelectorAll('.btn-edit');
  UpdateBtns.forEach(button=>{
    button.addEventListener('click',()=>{
        let QuestionId=button.dataset.id;
        console.log("id de question ",QuestionId)
location.href = `/question/update/${QuestionId}`;

 
    })
  })
})

