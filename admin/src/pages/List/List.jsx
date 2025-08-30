import React, { useEffect,useState} from 'react'
import './List.css'
import axios from "axios"
import { toast,ToastContainer } from "react-toastify";

const List = ({url}) => {



  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    // console.log(response.data);
    
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
  try {
    console.log("Removing food with ID:", foodId);
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    console.log("Remove response:", response.data);
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchList(); // Fetch the updated list after successful removal
    } else {
      toast.error(response.data.message || "Error occurred while removing food.");
    }
  } catch (error) {
    console.error("Error removing food:", error);
    toast.error("Error occurred while removing food.");
  }
};
    
  useEffect(() => {
    fetchList()
  
  }, [])
  

  return (
    <div className="list add flex-col">
      <ToastContainer/>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default List
