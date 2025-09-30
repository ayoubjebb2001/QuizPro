let editMode = false;
let editCategoryId = null;

// Boutons Modifier
document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', () => {
        editMode = true;
        editCategoryId = button.dataset.id;
        const name = button.dataset.name;
        const description = button.dataset.description;

        document.querySelector('#categoryName').value = name;
        document.querySelector('#categoryDescription').value = description;
        document.querySelector(".btn-submit").textContent = "Modifier";
    });
});

// Formulaire Ajouter/Modifier
document.querySelector('#categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.querySelector('#categoryName').value;
    const description = document.querySelector('#categoryDescription').value;

    try {
        if (editMode && editCategoryId) {
            // Modifier
            const res = await fetch(`/category/update/${editCategoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            const data = await res.json();
            if (data.error) alert(data.error);
            else window.location.reload();
        } else {
            // Ajouter
            e.target.submit(); // POST normal
        }
    } catch (err) {
        alert(err);
    }
});

// Supprimer
document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', async function() {
        const categoryId = this.dataset.id;
        if (!categoryId) return;

        if(confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
            try {
                const response = await fetch('/category/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: categoryId })
                });
                const data = await response.json();

                if (data.error) alert(data.error);
                else window.location.reload();
            } catch (err) {
                alert(err);
            }
        }
    });
});
