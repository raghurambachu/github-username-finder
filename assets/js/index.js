class GithubFinder{
    constructor(){
        this.form_DOM = document.querySelector(".search-form");
        this.rightSideTop_DOM = document.querySelector(".right-side-top");
        this.rightSideBottom_DOM = document.querySelector(".right-side-bottom");
        this.searchBtn_DOM = document.querySelector(".search-icon");
        this.data = "";
        this.handlerFunctions();
        
    }

    handlerFunctions(){
        this.form_DOM.addEventListener("submit",(e) =>{
            e.preventDefault();
            this.rightSideBottom_DOM.innerHTML = "";
            const username = e.currentTarget.querySelector("input").value;
            e.currentTarget.querySelector("input").value = "";
            this.createXmlRequest(username)
        })

        this.searchBtn_DOM.addEventListener("click",(e) => {
            this.rightSideBottom_DOM.innerHTML = "";
            let username_DOM = document.querySelector(".search-input");
            let username = username_DOM.value;
            username_DOM.value = "";
            this.createXmlRequest(username);
        })

        document.body.addEventListener("click",(e) => {
            this.handleClickOnClickables(e);
        })
    }

    

    createXmlRequest(username){
        const xhr = new XMLHttpRequest();

        xhr.open("GET",`https://api.github.com/users/${username}`);
        xhr.onload = () => {
            this.data = JSON.parse(xhr.response);
            if(!this.data.message){
                this.createRightTopUI();
            } else {
                this.rightSideTop_DOM.innerHTML = "<p style='text-align:center'>Sorry No such user found.</p>"
            }
            // this.createRightBottomUI()
        }

        xhr.onerror = () => {
            console.log(xhr.response)
        }

        xhr.onprogress = () => {
            this.rightSideTop_DOM.innerHTML = "<img src='../img/loading.gif'>"
        }

        xhr.send();
    }

    createRightTopUI(){
        this.rightSideTop_DOM.innerHTML = `
            <div class="avatar">
                <img src=${this.data.avatar_url} alt="Avatar">
            </div>
            <h3>
                ${this.data.name ? this.data.name : ""}
            </h3>
            <h4>
                <a href=${this.data.html_url}>(${this.data.login})</a>
            </h4>
            <p>
                <span>Followers : 
                    <a class="clickable" display="followers" data-link=${this.data.followers_url} href="#right-side-bottom-left">
                        ${this.data.followers}
                    </a>
                </span>
                <span>Following : 
                    <a class="clickable" display="following" data-link=${this.data.following_url} href="#right-side-bottom-left">
                        ${this.data.following}
                    </a>
                </span>
                <span>Repos : 
                    <a class="clickable" display="repos" data-link=${this.data.repos_url} href="#right-side-bottom-left">
                        ${this.data.public_repos}
                    </a>
                </span>
                <span>Gists : 
                   
                        ${this.data.public_gists}
                  
                </span>
            </p>
        `

    }

    handleClickOnClickables(e){
        if(!e.target.closest(".clickable"))return;
        e.preventDefault();
        const type = e.target.getAttribute("display");
        let typeLink = e.target.dataset.link;
        if(type === "following"){
            typeLink = typeLink.replace("{/other_user}","")
        }
        let typeData = "";
        let typeXhr = new XMLHttpRequest();
        
        typeXhr.open("GET",typeLink);
        typeXhr.onload = () => {
            typeData = JSON.parse(typeXhr.response);
            


            this.createUIForClickables(typeData,type);


        }
        typeXhr.send();

        
    }

    createUIForClickables(typeData,type){
        this.rightSideBottom_DOM.innerHTML = "";
        
        let innerHTMLStr = "";
        switch(type){
            case "followers":
                innerHTMLStr += `
                    ${typeData.map(follower => {
                        return `
                            <article class="card flex">
                                <div class="card-img">
                                    <img src=${follower.avatar_url} alt="${follower.login}-avatar">
                                </div>
                                <div class="info-holder">
                                    <div class="info-holder-top ">
                                    
                                        <h3>  
                                            <a href=${follower.html_url}> 
                                                ${follower.login}
                                            </a>
                                        </h3>
                                    </div>
                                
                                </div>
                            </article>
                        `
                    }).join("")}
                `;
            break;
            case "following":
                innerHTMLStr += `
                    ${typeData.map(following => {
                        return `
                            <article class="card flex">
                                <div class="card-img">
                                    <img src=${following.avatar_url} alt="${following.login}-avatar">
                                </div>
                                <div class="info-holder">
                                    <div class="info-holder-top ">
                                    
                                        <h3>  
                                            <a href=${following.html_url}> 
                                                ${following.login}
                                            </a>
                                        </h3>
                                    </div>
                                
                                </div>
                            </article>
                        `
                    }).join("")}
                `;
            break;
            case "repos" : 
                innerHTMLStr += `
                    ${
                        typeData.map(repo => {
                            return `
                            <article class="card-repo">
                                <div class="card-top">
                                    <a href=${repo.html_url}>
                                        <h3>${repo.name}</h3>
                                    </a>
                                </div>
                                <div>
                                    <h4>${repo.full_name}</h4>
                                    <span>
                                        ${repo.description ? "<p>"+ repo.description +"</p>" : ""}
                                    </span>
                                    <div class="icons flex">
                                        <span>
                                            ${repo.private ? "<img src='../assets/img/lock.svg'>" : "<img src='../assets/img/unlock.svg'>"}
                                        </span>
                                        <span class="icon">  
                                            <a href=${repo.clone_url}>
                                                <img src='../assets/img/cloud-download-alt.svg'>
                                            </a>
                                    </span>
                                    </div>
                                </div>
                            </article>
                            `
                        }).join("")
                    }
                `

        }
        this.rightSideBottom_DOM.innerHTML = innerHTMLStr;
    }

    // createRightBottomUI(){
        
    // }


}


new GithubFinder();