 let answerCount = 1;
        const answersContainer = document.getElementById('answersContainer');
        const correctAnswersContainer = document.getElementById('correctAnswersContainer');
        const addAnswerBtn = document.getElementById('addAnswerBtn');

        addAnswerBtn.addEventListener('click', function() {
            answerCount++;
            
            const answerItem = document.createElement('div');
            answerItem.className = 'answer-item';
            answerItem.innerHTML = `
                <input type="text" placeholder="answer goes here" class="answer-input" required>
                <button type="button" class="btn-remove">Remove</button>
            `;
            answersContainer.appendChild(answerItem);

            const checkboxGroup = document.createElement('div');
            checkboxGroup.className = 'checkbox-group';
            checkboxGroup.innerHTML = `
                <input type="checkbox" id="correct${answerCount}" value="${answerCount - 1}">
                <label for="correct${answerCount}">answer ${answerCount}</label>
            `;
            correctAnswersContainer.appendChild(checkboxGroup);

            const removeBtn = answerItem.querySelector('.btn-remove');
            removeBtn.addEventListener('click', function() {
                const index = Array.from(answersContainer.children).indexOf(answerItem);
                answerItem.remove();
                correctAnswersContainer.children[index].remove();
                updateAnswerLabels();
            });
        });

        function updateAnswerLabels() {
            const checkboxGroups = correctAnswersContainer.querySelectorAll('.checkbox-group');
            checkboxGroups.forEach((group, index) => {
                const checkbox = group.querySelector('input');
                const label = group.querySelector('label');
                checkbox.id = `correct${index + 1}`;
                checkbox.value = index;
                label.setAttribute('for', `correct${index + 1}`);
                label.textContent = `answer ${index + 1}`;
            });
            answerCount = checkboxGroups.length;
        }

       document.getElementById('questionForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const question = document.getElementById('question').value;
    const category_id = document.getElementById('category').value;
    const options = Array.from(document.querySelectorAll('.answer-input')).map(input => input.value);
    const correctAnswers = Array.from(document.querySelectorAll('#correctAnswersContainer input:checked')).map(cb => parseInt(cb.value));

    if (correctAnswers.length === 0) {
        alert('Veuillez sélectionner au moins une réponse correcte');
        return;
    }

    const payload = {
        question,
        category_id,
        options,
        answer: correctAnswers
    };
    console.log("test",payload);

    try {
        const response = await fetch('/question/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok) {
            alert(' Question ajoutée avec succès !');
            console.log(data);
          
            document.getElementById('questionForm').reset();
        } else {
            console.log('error : ' + data.message);
        }
    } catch (err) {
        console.error('Erreur de requête :', err);
        
    }
});
