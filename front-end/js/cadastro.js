let usernameInput = document.getElementById("username")
let emailInput = document.getElementById("email")
let passwordInput = document.getElementById("password")
let confirmPasswordInput = document.getElementById("confirmPassword")
const messageResponse = document.getElementById("message")

async function registerNewUser() {
  let usernameValue = usernameInput.value
  let emailValue = emailInput.value
  let passwordValue = passwordInput.value
  let confirmPasswordValue = confirmPasswordInput.value
  const url = "https://desafio-4-inova-maranhao.onrender.com/usuario/cadastro"

  const formData = new URLSearchParams()
  formData.append("username", usernameValue)
  formData.append("email", emailValue)
  formData.append("password", passwordValue)
  formData.append("confirmPassword", confirmPasswordValue)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.message == "Usuário criado com sucesso!") {
          console.log("Deu certooo!!")

          usernameInput.value = ""
          emailInput.value = ""
          passwordInput.value = ""
          confirmPasswordInput.value = ""
          messageResponse.innerHTML = ""
        } else {
          messageResponse.innerHTML = data.message
        }
      })
  } catch (error) {
    console.error(error)
  }
}
