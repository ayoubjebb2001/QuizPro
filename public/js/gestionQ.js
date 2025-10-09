document.addEventListener("DOMContentLoaded", () => {
  let DeleteBtns = document.querySelectorAll('.btn-delete');
  DeleteBtns.forEach(button => {
    button.addEventListener('click', async () => {
      let QuestionId = button.dataset.id;
      try {
        const response = await fetch(`/admin/questions/delete/${QuestionId}`, {
          method: "DELETE"
        })

        if (!response.ok) {

          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        location.reload();

      }
      catch (error) {
        console.error(`Erreur  : ${error.message}`);
      }
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {

  let UpdateBtns = document.querySelectorAll('.btn-edit');
  UpdateBtns.forEach(button => {
    button.addEventListener('click', () => {
      let QuestionId = button.dataset.id;
      location.href = `/admin/questions/update/${QuestionId}`;
    })
  })
})

  