
export function ClustersNameRegCheck(value) {
    const reg = /^[A-Za-z0-9][A-Za-z0-9-._]{1,}$/;
    return reg.test(value);
}

export function BaseClustersNameRegCheck(value) {
    const reg = /^.+$/;
    return reg.test(value);
}

export function VarNameRegCheck(value) {
    const reg = /^[_A-Za-z][_A-Za-z0-9]*$/;
    return reg.test(value);
}
export function RedirectNameRegCheck(value) {
    const reg = /^[a-zA-Z0-9][a-zA-Z0-9_-]{1,49}$/;
    return reg.test(value);
}

export function AreaNameRegCheck(value) {
    const reg = /^[a-zA-Z0-9\_-]*$/g;
    return reg.test(value);
}

export function DominNameRegCheck(value) {
    const reg = /^[a-zA-Z0-9\._-]*$/g;
    return reg.test(value);
}

export function HealthRegCheck(value) {
    const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    return reg.test(value);
}

export function ClustersNameTwoRegCheck(value) {
    const reg = /^[A-Za-z0-9][A-Za-z0-9-._]{1,255}$/;
    return reg.test(value);
}

export function PatternIPRegCheck(value) {
    const reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/;
    return reg.test(value);
}

export function ClusterNameRegCheck(value) {
    const reg = /^[0-9a-zA-Z_-]{1,}$/;
    return reg.test(value);
}

export function ClusterNameTwoRegCheck(value) {
    const reg = /^[0-9a-zA-Z#+_-]{1,}$/;
    return reg.test(value);
}

export function ClusterNameThreeRegCheck(value) {
    const reg = /^[0-9]{1,}$/;
    return reg.test(value);
}

export function ClusterNameFourRegCheck(value) {
    const reg = /^[2-5]{1,}$/;
    return reg.test(value);
}

export function MailRegCheck(value) {
    const reg =
    /^((([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
    return reg.test(value);
}

export function ProductNameRegCheck(value) {
    const reg = /^[0-9a-zA-Z_]{1,}$/;
    return reg.test(value);
}

export function PhoneRegCheck(value) {
    const reg = /[a-zA-Z0-9\_\-\.\#][a-zA-Z0-9\_\-\.\#\;]*/;
    return reg.test(value);
}

export function currentLimitNameRegCheck(value) {
    const reg = /[_a-zA-Z0-9]+/;
    return reg.test(value);
}

export function VIpRegCheck(value) {
    const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
    return reg.test(value);
}

export function UserNameRegCheck(value) {
    const reg = /^[a-zA-Z0-9\.@_-]*$/g;
    return reg.test(value);
}

export function PasswordRegCheck(value) {
    const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\'"-+=\.,~`!@#\$%\^&\*\(\);:])(?=.{3,})/;
    return reg.test(value);
}

export function NumRegCheck(value) {
    const reg = /^(\d*)$/;
    return reg.test(value);
}

export function NumTwoRegCheck(value) {
    const reg = /^\d+$/;
    return reg.test(value);
}

export function NumThreeRegCheck(value) {
    const reg = /^[0-9]*$/;
    return reg.test(value);
}

export function CertNameRegCheck(value) {
    const reg = /^(?=.*[\'\"-+=\.,~`!@#\$%\^&\*\(\);:])/;
    return reg.test(value);
}

export function DescriptionRegCheck(value) {
    const reg = /[a-zA-Z0-9]{2}/;
    return reg.test(value);
}

export const roleUndefined = -1;
export const roleProduct = 0;
export const roleAdmin = 1;
export const systemProduct = {
    name: 'BFE'
};
export const role2name = {
    0: 'normal',
    1: 'admin'
};