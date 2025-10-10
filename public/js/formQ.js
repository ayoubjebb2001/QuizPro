const answersContainer = document.getElementById('answersContainer');
const correctAnswersContainer = document.getElementById('correctAnswersContainer');
const addAnswerBtn = document.getElementById('addAnswerBtn');
let answerCount = answersContainer ? answersContainer.children.length : 0;

const syncCheckboxValue = (index) => {
    if (!answersContainer || !correctAnswersContainer) return;
    const answerItem = answersContainer.children[index];
    const checkboxGroup = correctAnswersContainer.children[index];
    if (!answerItem || !checkboxGroup) return;

    const input = answerItem.querySelector('.answer-input');
    const checkbox = checkboxGroup.querySelector('input');

    if (input && checkbox) {
        checkbox.value = input.value;
    }
};

const syncAllCheckboxValues = () => {
    if (!answersContainer) return;
    Array.from(answersContainer.children).forEach((_, index) => {
        syncCheckboxValue(index);
    });
};

const attachInputListener = (answerItem) => {
    const input = answerItem.querySelector('.answer-input');
    if (!input) return;
    input.addEventListener('input', () => {
        const index = Array.from(answersContainer.children).indexOf(answerItem);
        if (index !== -1) {
            syncCheckboxValue(index);
        }
    });
};

if (addAnswerBtn && answersContainer && correctAnswersContainer) {
    Array.from(answersContainer.children).forEach((item) => {
        attachInputListener(item);
    });

    answersContainer.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('btn-remove')) {
            const answerItem = e.target.closest('.answer-item');
            const index = Array.from(answersContainer.children).indexOf(answerItem);
            answerItem.remove();

            if (correctAnswersContainer.children[index]) {
                correctAnswersContainer.children[index].remove();
            }

            updateAnswerLabels();
        }
    });

    addAnswerBtn.addEventListener('click', function () {
        const answerItem = document.createElement('div');
        answerItem.className = 'answer-item';
        answerItem.innerHTML = `
                <input type="text" placeholder="answer goes here" class="answer-input" required>
                <button type="button" class="btn-remove">Remove</button>
            `;
        answersContainer.appendChild(answerItem);

        attachInputListener(answerItem);

        const checkboxGroup = document.createElement('div');
        checkboxGroup.className = 'checkbox-group';
        checkboxGroup.innerHTML = `
                <input type="checkbox" value="">
                <label>answer</label>
            `;
        correctAnswersContainer.appendChild(checkboxGroup);

        updateAnswerLabels();
    });

    updateAnswerLabels();
    syncAllCheckboxValues();
}

function updateAnswerLabels() {
    if (!correctAnswersContainer) return;
    const checkboxGroups = correctAnswersContainer.querySelectorAll('.checkbox-group');
    checkboxGroups.forEach((group, index) => {
        const checkbox = group.querySelector('input');
        const label = group.querySelector('label');
        if (checkbox) {
            checkbox.id = `correct${index + 1}`;
        }
        if (label) {
            label.setAttribute('for', `correct${index + 1}`);
            label.textContent = `answer ${index + 1}`;
        }
        syncCheckboxValue(index);
    });
    answerCount = checkboxGroups.length;
}

const questionForm = document.getElementById('questionForm');

if (questionForm) {
    questionForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const question = document.getElementById('question').value;
        const category_id = document.getElementById('category').value;
        const options = Array.from(document.querySelectorAll('.answer-input')).map(input => input.value);
        const correctAnswers = Array.from(document.querySelectorAll('#correctAnswersContainer input:checked'))
            .map(cb => cb.value)
            .filter(value => value !== undefined && value !== null && value !== '');
        console.log("les options", options);
        if (correctAnswers.length === 0) {
            alert('Veuillez sélectionner au moins une réponse correcte');
            return;
        }

        const payload = { question, category_id, options, answer: correctAnswers };

        const QuestionId = document.getElementById('questionId').value;
        const url = QuestionId ? `/admin/questions/update/${QuestionId}` : '/admin/questions/add';
        const method = QuestionId ? 'PUT' : 'POST';
        console.log("ghir kanshofo wsfi ", payload);
        console.log("url", url);
        try {

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                alert('✅ Question sauvegardée avec succès !');
                window.location.href = "/admin/questions/";
            } else {
                console.log('error : ' + data.message);
            }
        } catch (err) {
            console.error('Erreur de requête :', err);
        }
    });
}

