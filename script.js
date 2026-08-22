/* =========================================================
   PRODUCTIQ — LANDING / INPUT PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("productForm");

    const mpnInput = document.getElementById("mpn");
    const brandInput = document.getElementById("brand");
    const descriptionInput = document.getElementById("description");

    const charCount = document.getElementById("charCount");

    const generateBtn = document.getElementById("generateBtn");

    const processingSection =
        document.getElementById("processingSection");

    const processingMessage =
        document.getElementById("processingMessage");


    /* =====================================================
       CHARACTER COUNTER
    ===================================================== */

    descriptionInput.addEventListener("input", () => {

        const length = descriptionInput.value.length;

        charCount.textContent = length;

    });


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        /* ---------------------------------------------
           Get input values
        --------------------------------------------- */

        const productData = {

            mpn: mpnInput.value.trim(),

            brand: brandInput.value.trim(),

            description: descriptionInput.value.trim()

        };


        /* ---------------------------------------------
           Basic validation
        --------------------------------------------- */

        if (!productData.mpn) {

            showFieldError(
                mpnInput,
                "Please enter the manufacturer part number."
            );

            return;
        }


        if (!productData.brand) {

            showFieldError(
                brandInput,
                "Please enter the brand."
            );

            return;
        }


        if (!productData.description) {

            showFieldError(
                descriptionInput,
                "Please enter a short product description."
            );

            return;
        }


        /* ---------------------------------------------
           Clear previous errors
        --------------------------------------------- */

        clearFieldErrors();


        /* ---------------------------------------------
           Start AI processing UI
        --------------------------------------------- */

        startProcessing();


        /*
         * TEMPORARY DEMO FLOW
         *
         * Later we will replace this with:
         *
         * fetch("http://localhost:5000/api/products/analyze", {
         *     method: "POST",
         *     headers: {
         *         "Content-Type": "application/json"
         *     },
         *     body: JSON.stringify(productData)
         * })
         *
         * The backend will then run the RAG pipeline.
         */


        console.log("Product submitted:", productData);


        await runProcessingAnimation();


        /*
         * TEMPORARY:
         *
         * Once the backend is ready, this is where we
         * redirect to / display the generated result.
         */

        console.log("AI processing simulation completed.");

    });


    /* =====================================================
       PROCESSING
    ===================================================== */

    function startProcessing() {

        processingSection.classList.remove("hidden");

        generateBtn.classList.add("loading");

        generateBtn.disabled = true;


        /*
         * Scroll to processing section
         */

        setTimeout(() => {

            processingSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 100);

    }


    async function runProcessingAnimation() {

        const steps = [

            {
                id: "step1",
                message: "Searching for relevant manufacturer information..."
            },

            {
                id: "step2",
                message: "Retrieving and analyzing technical documents..."
            },

            {
                id: "step3",
                message: "Extracting structured product attributes..."
            },

            {
                id: "step4",
                message: "Validating information and calculating confidence..."
            }

        ];


        for (let i = 0; i < steps.length; i++) {

            const currentStep =
                document.getElementById(steps[i].id);


            processingMessage.textContent =
                steps[i].message;


            currentStep.classList.add("active");


            /*
             * Simulated processing time.
             *
             * Later this entire function will be replaced
             * by actual backend progress/status.
             */

            await wait(1500);


            currentStep.classList.remove("active");

            currentStep.classList.add("completed");

        }


        processingMessage.textContent =
            "Product intelligence generated successfully.";


        /*
         * Reset button after demo.
         */

        generateBtn.classList.remove("loading");

        generateBtn.disabled = false;

    }


    /* =====================================================
       FIELD ERROR
    ===================================================== */

    function showFieldError(input, message) {

        input.focus();

        input.style.borderColor = "#C03F3A";

        input.style.boxShadow =
            "0 0 0 3px rgba(192, 63, 58, 0.08)";


        /*
         * Browser tooltip
         */

        input.setCustomValidity(message);

        input.reportValidity();

        input.addEventListener(
            "input",
            () => {

                input.style.borderColor = "";

                input.style.boxShadow = "";

                input.setCustomValidity("");

            },
            { once: true }
        );

    }


    /* =====================================================
       CLEAR FIELD ERRORS
    ===================================================== */

    function clearFieldErrors() {

        const fields = [
            mpnInput,
            brandInput,
            descriptionInput
        ];


        fields.forEach((field) => {

            field.style.borderColor = "";

            field.style.boxShadow = "";

            field.setCustomValidity("");

        });

    }


    /* =====================================================
       WAIT HELPER
    ===================================================== */

    function wait(milliseconds) {

        return new Promise((resolve) => {

            setTimeout(resolve, milliseconds);

        });

    }

});