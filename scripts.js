// Select the form elements
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

amount.oninput = () => {
    // Cada atualização no input vai invocar esse evento
    let value = amount.value.replace(/\D/g, "")

    // Transforma o valor em centavos (exemplo: 150/100 = 1.5 que é equivalente a R$ 1, 50)
    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    // Formata o valor no padrão BRL
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
})

return value;
}

form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
}

expenseAdd(newExpense)
}

function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)


        // Cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        expenseInfo.append(expenseName, expenseCategory)

        // Cria o valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<span>R$</span>${newExpense.amount.toUpperCase().replace("R$", "")}`

        // Cria o ícone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src","img/remove.sg")
        removeIcon.setAttribute("alt", "remover")

        // Adiciona as informações no item

        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // Adiciona o item na lista.

        expenseList.append(expenseItem)

        // Limpa o formulário para adicionar um novo item.
        formClear()

        // Atualiza os totais.
        updateTotals()

} catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
}
}

function updateTotals() {
    try {

    const items = expenseList.children // Retorna os elementos child

    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

// Variável para incrementar o total
let total = 0

// Percorre cada item (li) da lista (ul)

for(let item = 0; item < items.length; item++){
    const itemAmount = items[item].querySelector(".expense-amount")

    // Remover caracteres não numéricos e substitui a vírgula pelo ponto.
    let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

    // Converte o valor para float.
    value = parseFloat(value)

    if(isNaN(value)) {
        return alert (
            "Não foi possível calcular o total. O valor não parece ser um número."
        )
}

    // Incrementar o valor total.
    total += Number(value)

}

const symbolBRL = document.createElement("small")
symbolBRL.textContent = "R$"

// Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

// Limpa o conteúdo do elemento.
expensesTotal.innerHTML = ""

// Adiciona o símbolo da moeda e o valor total formatado.
expensesTotal.append(symbolBRL, total)


} catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais.")
}
}



expenseList.addEventListener("click", function (event) {
    // Verifica se o elemento clicado é o ícone de remover.
    if(event.target.classList.contains("remove-icon")){

        // Obtém a li pai do elemento clicado.
    const item = event.target.closest(".expense")
    item.remove()

    // Remove item da lista.
    item.remove()

    }

updateTotals()
})

function formClear() {
    // Limpa os inputs.
    expense.value = ""
    category.value = ""
    amount.value = ""

    // Colocas o foco no input de amount.
expense.focus()
}