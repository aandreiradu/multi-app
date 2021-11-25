// show login/register page
window.addEventListener('DOMContentLoaded', (event) => {
    const guid = sessionStorage.getItem('_guid');
    console.log('guid ', guid);
    if(guid) {
        console.log('are guid')
        // show login page for the moment
        document.getElementById('login').style.display = '';
        document.getElementById('register').style.display = 'none';
        document.getElementById('logOut').style.display = '';
    } else {
        // show register page
        console.log('n-are guid');
        document.getElementById('logOut').style.display = 'none';
        document.getElementById('register').style.display = '';
        document.getElementById('login').style.display = 'none';
    }
});




// check if user is logged in
const navItems = document.querySelectorAll('.nav-item');
const navItemsMobile = document.querySelectorAll('.nav-list-mobile');
const navigationItems = [...navItems,...navItemsMobile];
navigationItems.forEach((item) => {
    item.addEventListener('click', (e) => {
        console.log(e.target.textContent);
        let redirectTo = e.target.textContent;
        if(!sessionStorage.getItem('_guid')){
            Swal.fire({
                icon: 'error',
                title: 'Oops! ',
                text:`If you want to navigate to ${redirectTo}, you have to Log In! :D`
              });
        } else {
            console.log(`navigate to ${redirectTo}`);
            let URL;
            if(redirectTo.toLowerCase() == 'dogs'){
                URL = 'http://localhost:5500/DOG/index.html'
                window.location.replace(URL)
            } else if(redirectTo.toLowerCase() == 'log out'){
                URL = 'http://localhost:5500/index.html'
                window.location.replace(URL)
            }
            console.log(URL);
        }
    });
});




// LOGIN HERE
const loginBtn = document.getElementById('loginBtn');
const sendDataLogin = async (url,options) => {
    const response = await fetch(url,options);
    const data = await response.json();
    if(data){
        console.log(data);
        let {status,message,id} = data;
        if((status == 'Success' || status == 200) && message == 'User found in database'){
            console.log('redirect user to app');
            sessionStorage.setItem('_guid',id);
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Authentication successful',
                    text:`Now, you can use the navigation bar to go through the pages!`
                  });
            }, 500);
            document.getElementById('logOut').style.display = '';
        } else if ((status == 'Success' || status == 200) && message == 'Not Found'){
            console.log('user not found');
            setTimeout(() => {
                // Swal.fire({
                //     icon: 'warning',
                //     title: 'Not found',
                //     text:'We found nothing with these cedentials.'
                //   });
                  const usernameAndIcon = document.querySelector('.usernameAndIcon');
                  usernameAndIcon.classList.add('invalid-field');
                  usernameAndIcon.classList.add('invalid-field-shake');
                  const passwordAndIcon = document.querySelector('.passwordAndIcon');
                  passwordAndIcon.classList.add('invalid-field');
                  passwordAndIcon.classList.add('invalid-field-shake');
                // location.reload();
            },700);
        }
    }
}

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('pressed');

    let emailInput = document.getElementById('usernameLogin').value;
    let passwordInput = document.getElementById('passwordLogin').value;

    console.log(emailInput,passwordInput)

    if(emailInput && passwordInput) {
        let payload = {};
        payload.email = emailInput;
        payload.password = passwordInput;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: JSON.stringify(payload)
        }
        
        sendDataLogin('/login',options);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill the inputs!'
          })
        console.log('Please fill the inputs!');
    }
    
}); 


// RESGITER HERE
const regiserBtn = document.getElementById('registerBtn');
const sendDataRegister = async(url,options) => {
    const response = await fetch(url,options);
    const data = await response.json();
    if(data){
        console.log(data);

        // email used
        if(data.status == 'Email used'){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'This email is used. Please Register with another one!'
              });

            const emailField = document.querySelector('.emailAndIcon');
            emailField.classList.add('invalid-field');

        } else if(data.status == 'Username taken'){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'This username is taken. Please Register with another one!'
              });

              const usernameField = document.querySelector('#register .usernameAndIcon');
              usernameField.classList.add('invalid-field');

        } else if(data.status == 'Success'){
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Success ',
            //     text: 'You have successfully registered, now you can access your account!'
            //   });
            const usernameField = document.querySelector('#register .usernameAndIcon');
            const emailField = document.querySelector('.emailAndIcon');
            usernameField.classList.remove('invalid-field');
            emailField.classList.remove('invalid-field');

            document.getElementById('usernameRegister').value = '';
            document.getElementById('passwordRegister').value = '';
            document.getElementById('emailRegister').value = '';
            happyAnimation();
        }   
    }
}
regiserBtn.addEventListener('click',(e) => {
    console.log('Register Pressed');
    e.preventDefault();

    let usernameRegister = document.getElementById('usernameRegister').value;
    let passwordRegister = document.getElementById('passwordRegister').value;
    let emailRegister = document.getElementById('emailRegister').value;

    console.log(usernameRegister,passwordRegister,emailRegister);

    

    if(usernameRegister && passwordRegister && emailRegister){
        let payload = {};
        payload.username = usernameRegister;
        payload.password = passwordRegister;
        payload.email = emailRegister;
        console.log(payload);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: JSON.stringify(payload)
        }
        
        sendDataRegister('/register',options);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill the inputs!'
          })
        console.log('Please fill the inputs!');
    }
});


const happyAnimation = () => {
    document.getElementById('register').classList.add('goAway');
    setTimeout(() => {
        document.getElementById('register').style.display = 'none';
    }, 3000);
    document.getElementById('login').classList.add('showInPage');
    document.getElementById('login').style.display = '';
}

const logInHere = document.querySelector('.logInHere');
logInHere.addEventListener('click',() => {
    console.log('clicked');
    // happyAnimation();

    console.log('clickedd');
    const login = document.getElementById('login');
    login.classList.remove('showInPage');
    login.style.display = 'flex';
    const register = document.getElementById('register');
    register.classList.remove('goAway');
    register.style.display = 'none';
});

const signUpHere = document.querySelector('.signUpHere');
signUpHere.addEventListener('click', () => {
    console.log('clickedd');
    const login = document.getElementById('login');
    login.classList.remove('showInPage');
    login.style.display = 'none';
    const register = document.getElementById('register');
    register.classList.remove('goAway');
    register.style.display = 'flex';
});


// LOGOUT button
const logOutDesktop = document.getElementById('logOut');
const logOutMobile = document.getElementById('logOutMobile');
const logOutBtns = [logOutDesktop,logOutMobile];
logOutBtns.forEach((logOut) => {
    logOut.addEventListener('click', () => {
        if(sessionStorage.getItem('_guid')){
            sessionStorage.removeItem('_guid');
            Swal.fire({
              icon: "success",
              title: "Success...",
              text: "Log Out...",
            });
            window.location.replace('http://localhost:5500/index.html');
            // setTimeout(() => {
                
            // }, 1000);
        }
    });
});







// remove RED border when the use is typing in username input
const usernameLogin = document.querySelector("#usernameLogin");
const passwordLogin = document.querySelector("#passwordLogin");
const passwordAndIcon = document.querySelector(".passwordAndIcon");
const usernameAndIcon = document.querySelector(".usernameAndIcon");
usernameLogin.addEventListener('keyup', () => {
    if(usernameAndIcon.classList.contains('invalid-field')){
        usernameAndIcon.classList.remove('invalid-field');
        usernameAndIcon.classList.remove('invalid-field-shake');
    }
});

// remove RED border when the use is typing in password input
passwordLogin.addEventListener('keyup', () => {
    if(passwordAndIcon.classList.contains('invalid-field')){
        passwordAndIcon.classList.remove('invalid-field');
        passwordAndIcon.classList.remove('invalid-field-shake');
    }
})


// footer current year
let currentYear = document.getElementById('currentYear');
currentYear.textContent = new Date().getFullYear();

// MOBILE VERSION

// open menu slider 
const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinksMobile = document.querySelector('.nav-links-mobile');
const closeMenu = document.getElementById('close-hamburger');
console.log(closeMenu);
hamburgerMenu.addEventListener('click', () => {
    console.log('clicked on hamburger');
    navLinksMobile.classList.add('widthGrowth');
    navLinksMobile.classList.remove('widthGrowthReverse');
    closeMenu.style.display = 'block';
    hamburgerMenu.style.display = 'none';
});


// close menu slider
const closeHamburger = document.getElementById('close-hamburger');
closeHamburger.addEventListener('click', () => {
    console.log('close menu');
    navLinksMobile.classList.remove('widthGrowth');
    navLinksMobile.classList.add('widthGrowthReverse');
    closeMenu.style.display = 'none';
    hamburgerMenu.style.display = 'block';
});

// close menu after user clicked on an menu-item
const navItemMobile = document.querySelectorAll('.nav-item-mobile');
navItemMobile.forEach((item) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navLinksMobile.classList.remove("widthGrowth");
        navLinksMobile.classList.add("widthGrowthReverse");
        closeMenu.style.display = "none";
        hamburgerMenu.style.display = "block";
    });
});