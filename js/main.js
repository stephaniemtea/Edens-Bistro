// *************** REUSABLE *************** //
const parseInput = type => {
    if (type === "PHONE") {
        const phoneElem = $("#phone");
        const phoneElemVal = phoneElem.val();
        if (phoneElemVal === "") {
            return;
        }
        const tp = phoneElemVal.replaceAll("-", "");
        const phoneParsed = `${tp.substring(0, 3)}-${tp.substring(
            3,
            6
        )}-${tp.substring(6, 10)}`;
        phoneElem.val(phoneParsed);
    }
};

// *************** REGISTER *************** //
const submitRegister = async () => {
    const fields = $("input");
    const postObj = {};

    for (field of fields) {
        postObj[field.id] = field.value;
    }

    const response = await fetch(
        "./api/register/registerUser.php?type=REGISTER",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postObj)
        }
    );

    const data = await response.json();

    if (data.message === "SUCCESS") {
        location.replace("./login.php?registered");
    } else {
        // TODO: Send to register
        alert("There was a problemo");
    }
};

const handleNextPage = async (event, currentPage) => {
    event.preventDefault();

    const validationData = await validateSection(currentPage);

    if (validationData.type === "SUCCESS") {
        $("#alert-box").hide();
        $(`#sec-${currentPage}`).hide();

        if (currentPage === 3) {
            submitRegister();
            return;
        }

        const nextPage = currentPage + 1;
        $(`#sec-${nextPage}`).show();
    } else {
        $("#alert-box").show();
        $("#alert-box").html(validationData.message);
    }
};

const handleLastPage = currentPage => {
    $("#alert-box").hide();
    $(`#sec-${currentPage}`).hide();

    if (currentPage === 1) {
        alert("at start");
    } else {
        const lastPage = currentPage - 1;
        $(`#sec-${lastPage}`).show();
    }
};

//* Validate Inputs And Store In Server
const validateSection = async page => {
    let data;
    if (page === 1) {
        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const email = $("#email").val();
        const phone = $("#phone").val();

        data = await fetch(
            `./api/register/registerUser.php?type=VALIDATE&page=${page}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone
                })
            }
        );
    } else if (page === 2) {
        const addressLineMain = $("#addressLineMain").val();
        const addressLineSecondary = $("#addressLineSecondary").val();
        const city = $("#city").val();
        const state = $("#state").val();
        const zip = $("#zip").val();

        data = await fetch(
            `./api/register/registerUser.php?type=VALIDATE&page=${page}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    addressLineMain,
                    addressLineSecondary,
                    city,
                    state,
                    zip
                })
            }
        );
    } else if (page === 3) {
        const username = $("#username").val();
        const password = $("#password").val();
        const confirmPassword = $("#confirmPassword").val();

        data = await fetch(
            `./api/register/registerUser.php?type=VALIDATE&page=${page}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password,
                    confirmPassword
                })
            }
        );
    }

    return await data.json();
};

const checkPasswordMatch = () => {
    const passwordElem = $("#password");
    const cPasswordElem = $("#confirmPassword");

    // Trigger Errors If Passwords Don't Match
    if (passwordElem.val() !== cPasswordElem.val()) {
        passwordElem[0].setCustomValidity("Invalid field");
        cPasswordElem[0].setCustomValidity("Invalid field");
    } else {
        passwordElem[0].setCustomValidity("");
        cPasswordElem[0].setCustomValidity("");
    }
};

// *************** ORDER *************** //
const addToCart = async itemId => {
    const quantity = $(`#${itemId}-qty`).val();
    const response = await fetch("./api/cart/addToCart.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            itemId,
            quantity
        })
    });
    const data = await response.json();

    location.reload();
};

const modifyCart = async (action, itemId, quantity) => {
    if (action === "SHOW") {
        // Exit Early As Just Populating Modal
        $("#modifyItemQty").val(quantity);
        $("#modifyItemId").val(itemId);

        $("#modifyItemModal").modal("toggle");

        return;
    }

    itemId = $("#modifyItemId").val();
    quantity = $("#modifyItemQty").val();

    const requestBody = action === "AMOUNT" ? { itemId, quantity } : { itemId };

    const response = await fetch(`./api/cart/modifyCart.php?action=${action}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });
    const data = await response.json();

    location.reload();
};

// *************** MANAGE *************** //
const changeAdminStatus = async event => {
    const userId = event.target.value;
    const isAdmin = event.target.checked;

    const response = await fetch("./api/manage/changeUserStatus.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId,
            isAdmin
        })
    });
    const data = await response.json();

    if (data.type !== "SUCCESS") {
        alert("There has been an error updating the user");
    }
};
