 const addAnswerBtn = document.getElementById('addAnswerBtn');
 let answerCount=1;
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


