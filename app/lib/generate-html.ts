

export default function GenerateHTML(title: string, highlights: string[], markdown: boolean = false): string {
    return `
        <div id="pdf-template">
            ${ !markdown && (
            `
            <style>
                h3 {
                    color: #6c757d;
                    margin-bottom: 2rem;
                }

                li {
                    font-size: 1rem;
                    font-weight: 300;
                }

                li::before {
                    content: "";
                    display: inline-block;
                    height: 5px;
                    width: 5px;
                    border-radius: 5px;
                    background: black;
                    margin-right: .5rem;
                }

            </style>
            `
            )}
            <h3>${title}</h3>
            <ol>
            ${highlights.reduce((acc, curr) => acc.concat(`<li>${curr}</li><br />\r\n`), '')}
            </ol>
        </div>
    `
}