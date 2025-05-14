const home = async (req, res) => {
    return res.status(200).json({ message: "Hello from Home Controller" })
}

export default home