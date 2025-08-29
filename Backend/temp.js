product = {
    title,
    description,
    images: [ string ],
    price,
    stock,
    seller: sellerId
}


user = {

    email: string,
    phone: string,
    password: string,
    fullName: {
        firstName: string,
        lastName: string
    },
    role: "user" | "seller"

}


payment = {
    user: userId,
    product: Id,
    price: Number,
    createAt: Date
}