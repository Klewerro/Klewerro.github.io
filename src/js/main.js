"use strict";

const projectsContainer = document.querySelector('.projects__container--js');

fetch('https://api.github.com/users/klewerro/repos?sort=pushed&direction=desc')
    .then(response => response.json())
    .then(json => {
        const repos = json;

        for (const repo of repos.slice(0, 6)) {
            const { name, pushed_at } = repo;
            let lastCommitMessage;
            fetch(`https://api.github.com/repos/klewerro/${name}/commits`)
                .then(response => response.json())
                .then(json => lastCommitMessage = json[0].commit.message)
                .then(() =>  projectsContainer.innerHTML += repoToHtml(repo, lastCommitMessage));
        }

        checkNumberOfRemainingRequests();
    })
    .catch(err => {
        console.log(err);
        checkNumberOfRemainingRequests();
    });


function repoToHtml(repo, lastCommitMessage) {
    const { description, name, homepage, html_url, pushed_at } = repo;
    
    return ` 
    <article class="project">
    <p class="project__updated" title="${lastCommitMessage}">Updated: ${new Date(pushed_at).toLocaleDateString()}</p>
    <section class="project__content">
      <img class="project__image" src="assets/img/github.svg" />
      <h3 class="project__title">${name}</h3>
    ${
        description ? `<p class="project__description">${description}</p>` : '<i>Description missing</i> 😟'
    } 
    </section>
    <footer class="project__footer">
    ${
        homepage ? `<a class="project__link project__link--demo" title="Demo: ${name}." target="_blank" rel="nofollow noreferrer" href="${homepage}">Demo</a>` : ''
    }
      <a class="project__link project__link--code" title="Source code: ${name}." target="_blank" rel="nofollow noreferrer" href="${html_url}">Github</a>
    </footer>
  </article>`;
}

function checkNumberOfRemainingRequests() {
    fetch('https://api.github.com/rate_limit')
    .then(response => response.json())
    .then(json => {
        const {limit, remaining} = json.rate;
        if (remaining > 0) {
            console.log("Remaining GitHub API requests for your IP address: ", 
            `${remaining}/${limit}`);
        } else {
            const message = "You have reached Github API 60 request per hour limit from your IP address. Unfortunatelly recent projects will be not available until reset."
            console.log(message);
            alert(message);
        }
        
    });
}
