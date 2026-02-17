
import fs from 'fs';
try {
    fs.writeFileSync('test_node_write.txt', 'hello');
    console.log('wrote file successfully');
} catch (e) {
    console.error(e);
}
