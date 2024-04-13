document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('.circle').addEventListener('click', function() {
      window.scrollBy(0, 750);
    });

   const locations = ["Thane", "Nerul", "Byculla","Dombivli"]; 
   let wordIndex = 0;
   let charIndex = 0;
   var typingEffect = document.getElementById("typing-effect");
    typingEffect.innerHTML = ""
    console.log(typingEffect)
   function type() {
     if (charIndex < locations[wordIndex].length) {
       typingEffect.textContent += locations[wordIndex].charAt(charIndex);
       charIndex++;
       setTimeout(type, 200); // Adjust typing speed (delay) as needed
     } else {
       setTimeout(erase, 1000); // Delay before erasing the word
     }
   }


  
 

   function erase() {
     if (charIndex > 0) {
       typingEffect.textContent = locations[wordIndex].substring(0, charIndex - 1);
       charIndex--;
       setTimeout(erase, 100); // Adjust erasing speed (delay) as needed
     } else {
       wordIndex++;
       if (wordIndex >= locations.length) {
         wordIndex = 0;
       }
       setTimeout(type, 500); // Delay before typing the next word
     }
   }
   
   type();


   const email = document.getElementById("email");
		const password = document.getElementById("password");
    const button = document.getElementById("submit");

		email.addEventListener('input',()=>{
			const emailBox = document.querySelector('.emailBox');
			const emailText = document.querySelector('.emailText');
			const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/;

			if(email.value.match(emailPattern)){
				emailBox.classList.add('valid');
				emailBox.classList.remove('invalid'); 
				emailText.innerHTML = "Your Email Address in Valid";
        email.style.borderColor = "green"
        button.style.backgroundColor = "#fb0e28"
        button.style.borderColor = "#fb0e28"
        button.style.pointerEvents = "auto" 
       
			}else{
				emailBox.classList.add('invalid');
				emailBox.classList.remove('valid');
				emailText.innerHTML = "Must be a valid email address."; 
        email.style.borderColor= "red"; 
        button.style.backgroundColor = "gray"
        button.style.borderColor = "gray"
        button.style.pointerEvents = "none" 	
      }
		});

		password.addEventListener('input',()=>{
			const passBox = document.querySelector('.passBox');
			const passText = document.querySelector('.passText');
			const passPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

			if(password.value.match(passPattern)){
				passBox.classList.add('valid');
				passBox.classList.remove('invalid');
				passText.innerHTML = "Your Password in Valid";
        password.style.borderColor = "green"
        button.style.backgroundColor = "#fb0e28"
        button.style.borderColor = "#fb0e28"
        button.style.pointerEvents = "auto"  
			}else{
				passBox.classList.add('invalid');
				passBox.classList.remove('valid');
				passText.innerHTML = "Your password must be at least 6 characters as well as contain at least one uppercase, one lowercase, and one number."; 
        password.style.borderColor = "red"
        button.style.backgroundColor = "gray"
        button.style.borderColor = "gray"
        button.style.pointerEvents = "none" 
  
      }
		});

    });