let username = document.getElementById("username")
let email = document.getElementById("email")
let password = document.getElementById("password")
let confirmPassword = document.getElementById("confirmPassword")
const messageResponse = document.getElementById("message")
const btnCadastrar = document.getElementById("btn-cadastar")
const cadastroRealizado = document.getElementById("cadastro-realizado")

btnCadastrar.addEventListener("click", registerNewUser)

async function registerNewUser() {
  const url = "https://desafio-4-inova-maranhao.onrender.com/usuario/cadastro"

  const formData = new URLSearchParams()
  formData.append("username", username.value)
  formData.append("email", email.value)
  formData.append("password", password.value)
  formData.append("confirmPassword", confirmPassword.value)

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

          username.value = ""
          email.value = ""
          password.value = ""
          confirmPassword.value = ""
          messageResponse.innerHTML = ""

          cadastroRealizado.classList.remove("hidden")

          setTimeout(() => {
            // redirecionando para página de login
            window.location.href = "login.html"
          }, 2000)
        } else {
          messageResponse.innerHTML = data.message
        }
      })
  } catch (error) {
    console.error(error)
  }
}
