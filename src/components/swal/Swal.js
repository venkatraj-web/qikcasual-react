import Swal from "sweetalert2";

export const swalCheck = (props) => {
  return Swal.fire({
        title: 'Are you sure',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes,${props} data delete it!`
      });
    //   .then((result) => {
        // console.log(result);
        // if(result.isConfirmed){
        //   console.log(result);
        //   Swal.fire(
        //     'Deleted!',
        //     'Your file has been deleted.',
        //     'success'
        //   )
        // }
    //   })
}

export const swalDeleteMsg = (props) => {
    return Swal.fire("Deleted!", `Your ${props} file has been deleted.`, "success");
}