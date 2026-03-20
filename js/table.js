document.addEventListener("DOMContentLoaded", function() {
    const input = document.getElementById("myInput");
    const table = document.getElementById("myTable");
    
    if (!input || !table) return;

    input.addEventListener("keyup", function() {
        const filter = input.value.toUpperCase();
        const tbody = table.getElementsByTagName("tbody")[0];
        
        if (!tbody) return;
        
        const rows = tbody.getElementsByTagName("tr");

        for (let i = 0; i < rows.length; i++) {
            const rowText = rows[i].textContent || rows[i].innerText;
            
            if (rowText.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = ""; 
            } else {
                rows[i].style.display = "none"; 
            }
        }
    });
});