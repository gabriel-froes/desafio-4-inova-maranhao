let email = document.getElementById("email")
let password = document.getElementById("password")
const messageResponse = document.getElementById("message")
const btnEntar = document.getElementById("btn-entrar")

btnEntar.addEventListener("click", loginUser)

async function loginUser() {
  const url = "https://desafio-4-inova-maranhao.onrender.com/usuario/login"

  const formData = new URLSearchParams()
  formData.append("email", email.value)
  formData.append("password", password.value)

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
        if (data.message == "Login com sucesso!") {
          console.log("Deu certooo!!")

          email.value = ""
          password.value = ""
          messageResponse.innerHTML = ""
        } else {
          messageResponse.innerHTML = data.message
        }
      })
  } catch (error) {
    console.error(error)
  }
}
