document.addEventListener("DOMContentLoaded", () => {
  let originalDataArray;

  fetch("../data/data.json")
    .then((res) => res.json())
    .then((data) => {
      const trParent = document.getElementById("trParent");
      let dataArray = [...data];
      originalDataArray = [...data];
      let selectedRowIndex = null;
      let secondSelectedRowIndex = null;

      renderTable(dataArray);

      document.querySelector(".density-asc").addEventListener("click", () => {
        const sortedArray = dataArray.sort((a, b) => a.density - b.density);
        renderTable(sortedArray);
      });

      document.querySelector(".density-desc").addEventListener("click", () => {
        const sortedArray = dataArray.sort((a, b) => b.density - a.density);
        renderTable(sortedArray);
      });

      document.querySelector(".viscosity-asc").addEventListener("click", () => {
        const sortedArray = dataArray.sort((a, b) => a.viscosity - b.viscosity);
        renderTable(sortedArray);
      });

      document.querySelector(".viscosity-desc").addEventListener("click", () => {
        const sortedArray = dataArray.sort((a, b) => b.viscosity - a.viscosity);
        renderTable(sortedArray);
      });

      document.querySelector(".packsize-asc").addEventListener("click", () => {
        const sortedArray = dataArray.sort((a, b) => parseFloat(a.packSize) - parseFloat(b.packSize));
        renderTable(sortedArray);
      });

      document.querySelector(".packsize-desc").addEventListener("click", () => {
        const sortedArray = dataArray.sort((a, b) => parseFloat(b.packSize) - parseFloat(a.packSize));
        renderTable(sortedArray);
      });

      document.querySelector(".quantity-asc").addEventListener("click", () => {
        const sortedArray = dataArray.sort((a, b) => parseFloat(a.quantity) - parseFloat(b.quantity));
        renderTable(sortedArray);
      });

      document.querySelector(".quantity-desc").addEventListener("click", () => {
        const sortedArray = dataArray.sort((a, b) => parseFloat(b.quantity) - parseFloat(a.quantity));
        renderTable(sortedArray);
      });

      const upArrow = document.querySelector(".bi-arrow-up");
      const downArrow = document.querySelector(".bi-arrow-down");
      const deleteBtn = document.querySelector(".bi-trash");
      const swapBtn = document.querySelector(".bi-arrow-left-right");
      const resetBtn = document.querySelector(".bi-save");

      upArrow.disabled = true;
      downArrow.disabled = true;
      deleteBtn.disabled = true;
      swapBtn.disabled = true;

      function enableActionButtons() {
        upArrow.disabled = selectedRowIndex === null;
        downArrow.disabled = selectedRowIndex === null;
        deleteBtn.disabled = selectedRowIndex === null;
        swapBtn.disabled = selectedRowIndex === null || secondSelectedRowIndex === null;
      }

      upArrow.addEventListener("click", () => {
        if (selectedRowIndex > 0) {
          [dataArray[selectedRowIndex], dataArray[selectedRowIndex - 1]] = [
            dataArray[selectedRowIndex - 1],
            dataArray[selectedRowIndex],
          ];
          selectedRowIndex--;
          updateRowIds();
          renderTable(dataArray);
          enableActionButtons();
        }
      });

      downArrow.addEventListener("click", () => {
        if (selectedRowIndex < dataArray.length - 1) {
          [dataArray[selectedRowIndex], dataArray[selectedRowIndex + 1]] = [
            dataArray[selectedRowIndex + 1],
            dataArray[selectedRowIndex],
          ];
          selectedRowIndex++;
          updateRowIds();
          renderTable(dataArray);
          enableActionButtons();
        }
      });

      swapBtn.addEventListener("click", () => {
        if (selectedRowIndex !== null && secondSelectedRowIndex !== null) {
          [dataArray[selectedRowIndex], dataArray[secondSelectedRowIndex]] = [
            dataArray[secondSelectedRowIndex],
            dataArray[selectedRowIndex],
          ];
          updateRowIds();
          renderTable(dataArray);
          selectedRowIndex = null;
          secondSelectedRowIndex = null;
          enableActionButtons();
        }
      });

      resetBtn.addEventListener("click", () => {
        dataArray = [...originalDataArray]; 
        updateRowIds();
        renderTable(dataArray);
        selectedRowIndex = null;
        secondSelectedRowIndex = null;
        enableActionButtons();
      });

      // Delete selected row
      deleteBtn.addEventListener("click", () => {
        if (selectedRowIndex !== null) {
          dataArray.splice(selectedRowIndex, 1);
          updateRowIds();
          renderTable(dataArray);
          selectedRowIndex = null;
          secondSelectedRowIndex = null;
          enableActionButtons();
        }
      });

      const addRowForm = document.getElementById("addRowForm");
      const modalBody = document.getElementById("staticBackdrop");

      document.getElementById("addBtn").addEventListener("click", () => {
        const addRowFormArray = Array.from(addRowForm.querySelectorAll("input"));
        const formData = addRowFormArray.map((input) => input.value);
        const isFormValid = formData.every((value) => value !== "");

        if (isFormValid) {
          const newRow = {
            id: dataArray.length + 1,
            chemicalName: formData[0],
            vendor: formData[1],
            density: parseFloat(formData[2]),
            viscosity: parseFloat(formData[3]),
            packaging: formData[4],
            packSize: formData[5],
            unit: formData[6],
            quantity: parseFloat(formData[7]),
          };

          dataArray.push(newRow);
          renderTable(dataArray);
          alert("Row Added");

          modalBody.style.display = "none";
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          }
          document.body.classList.remove("modal-open");

          addRowForm.reset();
        } else {
          alert("All Fields are required");
        }
      });

      function renderTable(data) {
        trParent.innerHTML = "";
        data.forEach((item, index) => {
          const trChildRow = document.createElement("tr");

          const tdrightTick = document.createElement("td");
          const checkMark = document.createElement("input");
          checkMark.type = "checkbox";

          checkMark.addEventListener("click", () => {
            if (selectedRowIndex === null) {
              selectedRowIndex = index;
            } else if (selectedRowIndex !== null && secondSelectedRowIndex === null) {
              secondSelectedRowIndex = index;
            } else {
              selectedRowIndex = index;
              secondSelectedRowIndex = null;
            }
            enableActionButtons();
          });

          tdrightTick.appendChild(checkMark);
          trChildRow.appendChild(tdrightTick);

          const thScope = document.createElement("th");
          thScope.scope = "row";
          thScope.innerHTML = item.id;
          trChildRow.appendChild(thScope);

          const tdchemicalName = document.createElement("td");
          tdchemicalName.innerHTML = item.chemicalName;
          trChildRow.appendChild(tdchemicalName);

          const tdVendor = document.createElement("td");
          tdVendor.innerHTML = item.vendor;
          trChildRow.appendChild(tdVendor);

          const tdDensity = document.createElement("td");
          const tdDensityInput = document.createElement("input");
          tdDensityInput.type = "number";
          tdDensityInput.value = item.density;
          tdDensity.appendChild(tdDensityInput);
          trChildRow.appendChild(tdDensity);

          const tdViscosity = document.createElement("td");
          const tdViscosityInput = document.createElement("input");
          tdViscosityInput.type = "number";
          tdViscosityInput.value = item.viscosity;
          tdViscosity.appendChild(tdViscosityInput);
          trChildRow.appendChild(tdViscosity);

          const tdPacking = document.createElement("td");
          tdPacking.innerHTML = item.packaging;
          trChildRow.appendChild(tdPacking);

          const tdPackSize = document.createElement("td");
          tdPackSize.innerHTML = item.packSize;
          trChildRow.appendChild(tdPackSize);

          const tdUnit = document.createElement("td");
          tdUnit.innerHTML = item.unit;
          trChildRow.appendChild(tdUnit);

          const tdQuantity = document.createElement("td");
          const tdQuantityInput = document.createElement("input");
          tdQuantityInput.type = "number";
          tdQuantityInput.value = item.quantity;
          tdQuantity.appendChild(tdQuantityInput);
          trChildRow.appendChild(tdQuantity);

          trParent.appendChild(trChildRow);
        });
      }

      function updateRowIds() {
        dataArray.forEach((item, index) => {
          item.id = index + 1;
        });
      }
    })
    .catch((err) => alert("Not able to retrieve data from JSON", err));
});
