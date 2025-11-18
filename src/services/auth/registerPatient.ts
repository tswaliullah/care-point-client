"use server";

export const registerPatient = async (_currentState : any, formData: any ) : Promise<any> => {
    try {
        const registerData = {
            password: formData.get('password'),
            patient: {
                name: formData.get('name'),
                address: formData.get('address'),
                email: formData.get('email'),
            }
        }

        const newFormData = new FormData();
        newFormData.append("data", JSON.stringify(registerData))

        const res = await fetch("http://localhost:5000/api/v1", {
            method: "POST",
            body: newFormData
        }).then(res => res.json());

        return res;

    } catch (error) {
        return {
            error: "Registration failed..!"
        }
    }
}