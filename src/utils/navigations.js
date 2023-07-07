import { BiCategory, BiCategoryAlt } from "react-icons/bi";
import { BsFillFileRichtextFill, BsPersonWorkspace } from "react-icons/bs";
import { CgOrganisation } from "react-icons/cg";
import { FaCity, FaUserShield, FaUsers } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";
import { RiShieldUserFill } from "react-icons/ri";
import { TbCategory2 } from "react-icons/tb";


export const getNavigations = (role) => {
    if(role === 'admin' || role === 'super-admin'){
        return [
            { path:"private-users", icon: <FaUserShield />, name: "PrivateUsers" },
            { path:"casuals", icon: <FaUsers />, name: "Casuals" },
            { path:"city", icon: <FaCity />, name: "City" },
            { path:"clients", icon: <RiShieldUserFill />, name: "Clients" },
            { path:"client-types", icon: <BiCategory />, name: "Client Types" },
            { path:"properties", icon: <CgOrganisation />, name: "Properties" },
            { path:"property-types", icon: <BiCategoryAlt />, name: "Property Types" },
            { path:"property-grades", icon: <TbCategory2 />, name: "Property Grades" },
            { path:"managers", icon: <GrUserManager />, name: "Managers" },
            { path:"job-types", icon: <BsPersonWorkspace />, name: "Job Types" },
            { path:"casual-jobs", icon: <BsFillFileRichtextFill />, name: "Casual Jobs" },
        ];
    } else if(role === 'sales'){
        return [
            { path:"private-users", icon: <FaUserShield />, name: "PrivateUsers" },
            { path:"clients", icon: <RiShieldUserFill />, name: "Clients" },
            { path:"properties", icon: <CgOrganisation />, name: "Properties" },
            { path:"managers", icon: <GrUserManager />, name: "Managers" },
            { path:"job-types", icon: <BsPersonWorkspace />, name: "Job Types" },
            { path:"casual-jobs", icon: <BsFillFileRichtextFill />, name: "Casual Jobs" },
        ];
    } else if(role === 'customer-success'){
        return [
            { path:"private-users", icon: <FaUserShield />, name: "PrivateUsers" },
        ];
    } else if(role === 'client-admin'){
        return [
            { path:"properties", icon: <CgOrganisation />, name: "Properties" },
            { path:"managers", icon: <GrUserManager />, name: "Managers" },
            { path:"casual-jobs", icon: <BsFillFileRichtextFill />, name: "Casual Jobs" },
        ];
    } else if(role === 'manager'){
        return [
            { path:"casual-jobs", icon: <BsFillFileRichtextFill />, name: "Casual Jobs" },
        ];
    } else {
        return null;
    }
}