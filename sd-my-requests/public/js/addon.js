/* add-on script */
$(document).ready(function () {
    // Require the request module
    AP.require(['request', 'messages'], function(request, messages) {
        // GET our Service Desk requests via the JIRA Service Desk REST API
        request({
            url: '/rest/servicedeskapi/request',
            success: function (response) {
                // Parse the response JSON
                var json = JSON.parse(response);

                // Store the base URL for later
                var baseUrl = json._links.base;

                // Did we get any requests back?
                if (json.values.length > 0) {
                    // Create a table with the resulting requests
                    $('<table>').addClass('aui').append(
                        $('<thead>').append(
                            $('<tr>').append(
                                $('<th>').text('Issue Key'),
                                $('<th>').text('Current Status'),
                                $('<th>').text('Summary'),
                                $('<th>').text('Date Created'),
                                $('<th>')
                            )
                        ),
                        $('<tbody>').append(
                            $.map(json.values, function (e) {
                                // Map each request to a HTML table row
                                return $('<tr>').append(
                                    $('<td>').append(
                                        $('<a>').attr('href',
                                            baseUrl + '/browse/' + e.issueKey)
                                            .attr('target', '_top')
                                            .text(e.issueKey)
                                    ),
                                    $('<td>').text(e.currentStatus.status),
                                    $('<td>').text(e.requestFieldValues[0].value),
                                    $('<td>').text(e.createdDate.friendly),
                                    $('<td>').append(
                                        $('<a>').attr('href',
                                            baseUrl + '/servicedesk/customer/portal/' + e.serviceDeskId + '/' + e.issueKey)
                                            .attr('target', '_blank')
                                            .text('View in customer portal')
                                    )
                                );
                            })
                        )
                    ).appendTo('#main-content');
                } else {
                    // Show a link to the Customer Portal
                    $('<div>').addClass('aui-message').append(
                        $('<p>').addClass('title').append(
                            $('<span>').addClass('aui-icon').addClass('icon-info'),
                            $('<strong>').text("It looks like you don't have any requests!")
                        ),
                        $('<p>').append(
                            $('<span>').text("Visit the "),
                            $('<a>').attr('href',
                                baseUrl + '/servicedesk/customer/portals')
                                .attr('target', '_blank')
                                .text('Customer Portal'),
                            $('<span>').text(" to create some.")
                        )
                    ).appendTo('#main-content');
                }
            },
            error: function (err) {
                $('<div>').addClass('aui-message').addClass('aui-message-error').append(
                    $('<p>').addClass('title').append(
                        $('<span>').addClass('aui-icon').addClass('icon-error'),
                        $('<strong>').text('An error occurred!')
                    ),
                    $('<p>').text(err.status + ' ' + err.statusText)
                ).appendTo('#main-content');
            }
        });
    });
});