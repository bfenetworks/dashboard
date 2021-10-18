import { i18n } from '@/utils/i18n';
export const controller = conditionVars => [
    {
        name: i18n.t('route.logicalConnector'),
        buttons: [
            {
                name: '(',
                expression: '('
            },
            {
                name: ')',
                expression: ')'
            },
            {
                name: '&&',
                expression: '&&'
            },
            {
                name: '||',
                expression: '||'
            },
            {
                name: '!',
                expression: '!'
            }
        ]
    },
    {
        name: 'host',
        buttons: [
            {
                name: 'in',
                description: 'req_host_in(patterns)',
                expression: 'req_host_in("")',
                example: '<p>req_host_in("www.baidu.com|www.tx.com")</p>'
            }
        ]
    },
    {
        name: 'port',
        buttons: [
            {
                name: 'in',
                description: 'req_port_in(patterns)',
                expression: 'req_port_in("")',
                example: '<p>req_port_in("80|8080")</p>'
            }
        ]
    },
    {
        name: 'method',
        buttons: [
            {
                name: 'in',
                description: 'req_method_in(patterns)',
                expression: 'req_method_in("")',
                example: '<p>req_method_in("GET")</p>'
            }
        ]
    },
    {
        name: 'path',
        buttons: [
            {
                name: 'in',
                description: 'req_path_in(patterns, case_insensitive)',
                expression: 'req_path_in("", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_path_in("/post", false)</p>`
            },
            {
                name: 'prefix_in',
                description: 'req_path_prefix_in(patterns, case_insensitive)',
                expression: 'req_path_prefix_in("", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_path_prefix_in("/report/", true)</p>`
            },
            {
                name: 'suffix_in',
                description: 'req_path_suffix_in(patterns, case_insensitive)',
                expression: 'req_path_suffix_in("", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_path_suffix_in("post", false)</p>`
            }
        ]
    },
    {
        name: 'query',
        buttons: [
            {
                name: 'exist',
                description: 'req_query_exist()',
                expression: 'req_query_exist()',
                example: '<p>req_query_exist()</p>'
            },
            {
                name: 'key_in',
                description: 'req_query_key_in(patterns)',
                expression: 'req_query_key_in("")',
                example: '<p>req_query_key_in("abc")</p>'
            },
            {
                name: 'key_prefix_in',
                description: 'req_query_key_prefix_in(patterns)',
                expression: 'req_query_key_prefix_in("")',
                example: '<p>req_query_key_prefix_in("sea")</p>'
            },
            {
                name: 'value_in',
                description: 'req_query_value_in(key, patterns, case_insensitive)',
                expression: 'req_query_value_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_query_value_in("search", "flower", false)</p>`
            },
            {
                name: 'value_prefix_in',
                description: 'req_query_value_prefix_in(key, patterns, case_insensitive)',
                expression: 'req_query_value_prefix_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_query_value_prefix_in("search", "flow", false)</p>`
            },
            {
                name: 'value_suffix_in',
                description: 'req_query_value_suffix_in(key, patterns, case_insensitive)',
                expression: 'req_query_value_suffix_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_query_value_suffix_in("search", "er", false)</p>`
            },
            {
                name: 'value_hash_in',
                description: 'req_query_value_hash_in(key, patterns, case_insensitive)',
                expression: 'req_query_value_hash_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_query_value_hash_in("search", "0-100|1000-1100|9999", false)</p>`
            }
        ]
    },
    {
        name: 'cookie',
        buttons: [
            {
                name: 'key_in',
                description: 'req_cookie_key_in(patterns)',
                expression: 'req_cookie_key_in("")',
                example: '<p>req_cookie_key_in("RE_SERVER_ID")</p>'
            },
            {
                name: 'value_in',
                description: 'req_cookie_value_in(key, patterns, case_insensitive)',
                expression: 'req_cookie_value_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_cookie_value_in("ssp-web-version", "v0", true)</p>`
            },
            {
                name: 'value_prefix_in',
                description: 'req_cookie_value_prefix_in(key, patterns, case_insensitive)',
                expression: 'req_cookie_value_prefix_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_cookie_value_prefix_in("RE_SERVER_ID", "171593627", false)`
            },
            {
                name: 'value_suffix_in',
                description: 'req_cookie_value_suffix_in(key, patterns, case_insensitive)',
                expression: 'req_cookie_value_suffix_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_cookie_value_suffix_in("RE_SERVER_ID", "171593627", false)</p>`
            },
            {
                name: 'value_hash_in',
                description: 'req_cookie_value_hash_in(key, patterns, case_insensitive)',
                expression: 'req_cookie_value_hash_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/>\
                <p>req_cookie_value_hash_in("RE_SERVER_ID", "0-100|1000-1100|9999", false)</p>`
            }
        ]
    },
    {
        name: 'header',
        buttons: [
            {
                name: 'key_in',
                description: 'req_header_key_in(patterns)',
                expression: 'req_header_key_in("")',
                example: '<p>req_header_key_in("Header-Preonline")</p>'
            },
            {
                name: 'value_in',
                description: 'req_header_value_in(header_name, patterns, case_insensitive)',
                expression: 'req_header_value_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_header_value_in("game-bfe-dev", "1", true)</p>`
            },
            {
                name: 'value_prefix_in',
                description: 'req_header_value_prefix_in(header_name, patterns, case_insensitive)',
                expression: 'req_header_value_prefix_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_header_value_prefix_in("game", "1", true)</p>`
            },
            {
                name: 'value_suffix_in',
                description: 'req_header_value_suffix_in(header_name, patterns, case_insensitive)',
                expression: 'req_header_value_suffix_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/><br/><p>req_header_value_suffix_in("dev", "1", true)</p>`
            },
            {
                name: 'value_hash_in',
                description: 'req_header_value_hash_in(key, patterns, case_insensitive)',
                expression: 'req_header_value_hash_in("", "", false)',
                example: `${i18n.t('route.tipExpression')}<br/>\
                <p>req_header_value_hash_in("RE_SERVER_ID", "0-100|1000-1100|9999", false)</p>`
            }
        ]
    },
    {
        name: 'clientIP',
        buttons: [
            {
                name: 'range',
                description: 'req_cip_range(patterns)',
                expression: 'req_cip_range("", "")',
                example: '<p>req_cip_range("1.1.1.1", "2.2.2.2")</p>'
            },
            {
                name: 'trusted',
                description: 'req_cip_trusted()',
                expression: 'req_cip_trusted()',
                example: '<p>req_cip_trusted()</p>'
            },
            {
                name: 'hash_in',
                description: 'req_cip_hash_in(patterns)',
                expression: 'req_cip_hash_in("")',
                example: '<p>req_cip_hash_in("0-100|1000-1100|9999")</p>'
            }
        ]
    },
    {
        name: 'proto',
        buttons: [
            {
                name: 'secure',
                description: 'req_proto_secure()',
                expression: 'req_proto_secure()',
                example: '<p>req_proto_secure()</p>'
            }
        ]
    },
    {
        name: 'system',
        buttons: [
            {
                name: 'bfe_time_range',
                description: 'bfe_time_range(start_time, end_time)',
                expression: 'bfe_time_range("", "")',
                example: '<p>bfe_time_range("20190204203000H", "20190204204500H")</p>'
            },
            {
                name: 'bfe_cluster_in',
                description: 'bfe_cluster_in(patterns)',
                expression: 'bfe_cluster_in("")',
                example: '<p>bfe_cluster_in("bfe-tc.ALB.tc|bfe.yf.ALB.yf")</p>'
            }
        ]
    },
    {
        name: 'condition vars',
        buttons: conditionVars
    }
];
export const connController = [
    {
        name: 'default_t',
        buttons: [
            {
                name: 'default_t',
                description: 'default_t()',
                expression: 'default_t()',
                example: '<p>default_t()</p>'
            }
        ]
    },
    {
        name: i18n.t('route.logicalConnector'),
        buttons: [
            {
                name: '(',
                expression: '('
            },
            {
                name: ')',
                expression: ')'
            },
            {
                name: '&&',
                expression: '&&'
            },
            {
                name: '||',
                expression: '||'
            },
            {
                name: '!',
                expression: '!'
            }
        ]
    }
];